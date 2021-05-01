import { Router } from "express";
import fs from "fs";
import { OutgoingHttpHeaders } from "http";
import mongoose from "mongoose";
import multer from "multer";
import { Video } from "../models";
import { Readable } from "stream";

const videoRouter: Router = Router();

videoRouter.get("/", (req, res) => {
  const range = req.headers.range;

  const videoPath =
    "/Users/arkadeepde/Movies/The Lion King (1994) (1)/The.Lion.King.1994.BluRay.720p.x264.YIFY.mp4";
  const videoSize = fs.statSync(videoPath).size;

  const CHUNK_SIZE = 1024 * 250;
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
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

const upload = multer({ dest: "uploads/" });
videoRouter.post("/", upload.single("video"), async (req, res) => {
  console.table(req.file);

  const trackName = req.body.name;

  // Covert buffer to Readable Stream
  const readableTrackStream = new Readable();
  readableTrackStream.push(req.file.buffer);
  readableTrackStream.push(null);

  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "tracks",
  });

  const uploadStream = bucket.openUploadStream(trackName);
  const id = uploadStream.id;
  readableTrackStream.pipe(uploadStream);
  const video = await Video.create({
    title: req.file.filename,
    description: "demo..",
    owner: new mongoose.mongo.ObjectId(),
    file_id: id,
  });
  console.table(video);
  uploadStream.on("error", () => {
    return res.status(500).json({ message: "Error uploading file" });
  });

  uploadStream.on("finish", () => {
    return res
      .status(201)
      .json({
        message:
          "File uploaded successfully, stored under Mongo ObjectID: " + id,
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
