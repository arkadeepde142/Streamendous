import { Router } from "express";
import fs from "fs";
import {OutgoingHttpHeaders} from "http";
import multer from "multer"; 

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
const upload = multer({ dest: 'uploads/' })
videoRouter.post("/", upload.single('video'), (req, res)=>{
  console.table(req.file)
  res.status(200).json({message : "video uploaded"})
})

export default videoRouter;
