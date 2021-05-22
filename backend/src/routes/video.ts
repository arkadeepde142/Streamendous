import { Router } from "express";
import fs from "fs";
import { OutgoingHttpHeaders } from "http";
import mongoose from "mongoose";
import multer from "multer";
import { Video } from "../models";

const videoRouter: Router = Router();

videoRouter.get("/:id", async (req, res) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "tracks",
  });
  const range = req.headers.range;

  const video_doc = await Video.findById(req.params.id)
  if(!video_doc){
    return res.status(400).json({message: "no video present against this id"})
  }
  const video_id = new mongoose.mongo.ObjectId(video_doc.file_id.toString())
  // console.table(stream)
  // console.log(bucket.find({_id:"60a212efee697e9b52a4866f"}))
  const videoSize = video_doc.size
  const CHUNK_SIZE = 1024 * 512;
  const start = Number(range?.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;

  const headers: OutgoingHttpHeaders = {
    "content-range": `bytes ${start}-${end}/${videoSize}`,
    "accept-ranges": "bytes",
    "content-length": `${contentLength}`,
    "content-type": "video/mp4",
  };
  
  res.writeHead(206, headers);
  const stream = bucket.openDownloadStream(video_id, {start, end})
  stream.pipe(res);
  
});

const upload = multer({ dest: "uploads/" });


videoRouter.post("/", upload.single("video"), async (req, res) => {
  console.table(req.file);

  const trackName = req.file.filename;
  const readableTrackStream = fs.createReadStream(req.file.path)

  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "tracks",
  });

  const uploadStream = bucket.openUploadStream(trackName);
  console.log(trackName);
  const id = uploadStream.id;
  readableTrackStream.pipe(uploadStream);
  const uploadable = await Video.create({
    title: req.file.filename,
    description: "demo..",
    owner: new mongoose.mongo.ObjectId(),
    file_id: id,
    size : req.file.size
  });
  // console.table(video);
  uploadStream.on("error", () => {
    return res.status(500).json({ message: "Error uploading file" });
  });
  readableTrackStream.on("end", () => {
    console.log("readable track ends.....");
  });
  uploadStream.on("finish", () => {
    return res.status(200).json({
      message: "File uploaded successfully, stored under Mongo ObjectID: " + uploadable._id,
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
});

export default videoRouter;
