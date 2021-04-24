import express from "express";
import { json } from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { videoRouter } from "./routes";

const main = async () => {
  dotenv.config();
  const app = express();

  app.use(json());


  app.use("/videos", videoRouter);
  app.get("/", (_, res) => {
    res.status(200).send(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
          body {
            margin: 40px auto;
            max-width: 650px;
            line-height: 1.6;
            font-size: 18px;
            font-family: "Courier New", Courier, monospace;
            color: #444;
            padding: 0 10px;
          }
          h2 {
            line-height: 1.2;
          }
        </style>
      </head>
    
      <body>
        <h2>HTTP Video Streaming</h2>
        <p>This video is 61MB and is being streamed instead of downloaded.</p>
        <p>
          Feel free to seek through the video and it only loads the part you want to
          watch
        </p>
        <video id="videoPlayer" width="650" controls muted="muted" autoplay>
          <source src="/videos" type="video/mp4" />
        </video>
        <i>Big Buck Bunny</i>
      </body>
    </html>`);
  })
  

  try {
    await mongoose.connect(process.env.URI as string, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connection Done");
  } catch (e) {
    console.error(e);
  }

  const server = app.listen(5000, () => {
    console.log("server running");
  });

  type Server = typeof server;

  const serverShutdown = (server: Server) =>
    new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) return reject(err);
        else resolve(null);
      });
    });

  const shutdown = async () => {
    await serverShutdown(server);
    console.log("Server shutdown");
    await mongoose.connection.close(true);
    console.log("Database closed.");
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

main();
