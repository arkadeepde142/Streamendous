import { Router } from "express";
import fs from "fs";
// import { OutgoingHttpHeaders } from "http";
import mongoose from "mongoose";
import multer from "multer";
import { IUser, IVideo, Video } from "../models";
import { requireJwtMiddleware } from "../auth";
import validator from "validator";

const videoRouter: Router = Router();
export interface VideoInfo {
  id: IVideo["_id"];
  title: IVideo["title"];
  description: IVideo["description"];
  ownerUserName: IUser["username"];
  createdAt: IVideo["createdAt"];
}
export interface VideoForm {
  title: IVideo["title"];
  description: IVideo["description"];
  userId: IUser["_id"];
}

videoRouter.get("/feed", async (req, res) => {
  const page: number = parseInt(req.query.page as string) || 1;
  const limit: number = parseInt(req.query.limit as string) || 10;
  try {
    const videos = await Video.find()
      .populate("owner", "username")
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    const videoResponse: VideoInfo[] = videos.map(
      (video): VideoInfo => ({
        id: video._id,
        title: video.title,
        description: video.description,
        ownerUserName: video.owner["username"],
        createdAt: video.createdAt,
      })
    );
    return res.status(200).json(videoResponse);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "server error occured" });
  }
});
videoRouter.head("/:id", async (req, res) => {
  const range = req.headers.range;

  const video_doc = await Video.findById(req.params.id).exec();
  if (!video_doc) {
    return res
      .status(400)
      .json({ message: "no video present against this id" });
  }
  // console.table(stream)
  // console.log(bucket.find({_id:"60a212efee697e9b52a4866f"}))
  const videoSize = video_doc.size;
  const CHUNK_SIZE = 1024 * 256;
  const start = Number(range?.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE - 1, videoSize - 1);

  const contentLength = end - start + 1;

  console.log("hochhe hochhe !");
  res.statusCode = 200;
  res.setHeader("accept-ranges", "bytes");
  res.setHeader("content-length", `${contentLength}`);

  res.end();
});
videoRouter.get("/:id", async (req, res) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "tracks", 
    chunkSizeBytes: 512*1024
  });
  const range = req.headers.range;
  // console.log(range)

  const video_doc = await Video.findById(req.params.id).exec();
  if (!video_doc) {
    return res
      .status(400)
      .json({ message: "no video present against this id" });
  }
  const video_id = new mongoose.mongo.ObjectId(video_doc.file_id.toString());
  // console.table(stream)
  // console.log(bucket.find({_id:"60a212efee697e9b52a4866f"}))
  const videoSize = video_doc.size;
  // console.log(videoSize);
  // const videoSize = fs.statSync("/Users/arpannandi/Desktop/Streamendous/backend/uploads/muisc_chorus.mp4").size;
  const CHUNK_SIZE = 1024 * 512;
  const parsed = String(range?.replace("bytes=","")).split("-");
  
  const start = Number(parsed[0]);
  
  const end = parsed[1]===""?Math.min(start + CHUNK_SIZE -1, videoSize - 1) :  Math.min(Number(parsed[1]), videoSize - 1);

  // const contentLength = end - start + 1;

  // const headers: OutgoingHttpHeaders = {
  //   "content-range": `bytes ${start}-${end}/${videoSize}`,
  //   "accept-ranges": "bytes",
  //   "content-length": `${contentLength}`,
  //   "content-type": "video/mp4",
  // };

  // res.writeHead(206, headers);
  // const file = fs.createReadStream("/Users/arpannandi/Desktop/Streamendous/backend/uploads/muisc_chorus.mp4", {start, end});

  const stream = bucket.openDownloadStream(video_id, { start, end });
  const file = fs.createWriteStream(`downloads/${video_id}${start}_${end}`);
  stream.pipe(file);
  stream.on("close", ()=>{
    file.close();
    const partSize = fs.statSync(`downloads/${video_id}${start}_${end}`).size;
    // console.log(partSize);
    res.statusCode = 206;
    res.setHeader("accept-ranges", "bytes");
    res.setHeader("content-length", `${partSize}`);
    res.setHeader("content-range", `bytes ${start}-${start+partSize-1}/${videoSize}`);
    res.setHeader("content-type", "video/mp4");
    const readStream = fs.createReadStream(`downloads/${video_id}${start}_${end}` );
    readStream.pipe(res);
    readStream.on("end", ()=>{
      // fs.unlinkSync(`downloads/${video_id}${start}_${end}`)
      fs.unlink(`downloads/${video_id}${start}_${end}`, ()=>{})
    })
  })
});

const upload = multer({ dest: "uploads/" });

videoRouter.post(
  "/",
  upload.single("video"),
  requireJwtMiddleware,
  async (req, res) => {
    console.table(req.file);
    console.table(req.body);
    const trackName = req.file.filename;
    const readableTrackStream = fs.createReadStream(req.file.path);

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "tracks",
    });
    const video_form: VideoForm = {
      title: req.body.title as string,
      description: req.body.description as string,
      userId: res.locals.session.id as string,
    };

    const uploadStream = bucket.openUploadStream(trackName);
    console.log(trackName);
    const id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);
    const uploadable = await Video.create({
      title: video_form.title,
      description: video_form.description,
      owner: video_form.userId,
      file_id: id,
      size: req.file.size,
    });
    // console.table(video);
    uploadStream.on("error", () => {
      return res.status(500).json({ message: "Error uploading file" });
    });
    readableTrackStream.on("end", () => {
      console.log("readable track ends.....");
    });
    uploadStream.on("finish", () => {
      fs.unlinkSync(req.file.path);
      return res.status(200).json({
        message:
          "File uploaded successfully, stored under Mongo ObjectID: " +
          uploadable._id,
      });
    });
    //   const resultHandler = function (err) {
    //     if (err) {
    //         console.log("unlink failed", err);
    //     } else {
    //         console.log("file deleted");
    //     }
    // }

    //   fs.unlink(req.file.path, resultHandler);
  }
);

videoRouter.get("/info/:id", async (req, res) => {
  const id = req.params.id;
  if (!validator.isMongoId(id)) {
    return res.status(404).json({ message: "id is not valid" });
  }
  const video = await Video.findById(id).populate("owner", "username").exec();
  if (!video) {
    return res.status(404).json({ message: "video is not available" });
  }
  const video_info: VideoInfo = {
    id: id,
    title: video.title,
    description: video.description,
    ownerUserName: video.owner["username"],
    createdAt: video.createdAt!,
  };
  return res.status(200).json(video_info);
  // const user_id = video?.owner
  // const username = await User.findById(user_id)
});

export default videoRouter;
