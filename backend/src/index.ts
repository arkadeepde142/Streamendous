import express from "express";
import { json } from "body-parser";
import mongoose, { connect } from "mongoose";
import dotenv from 'dotenv';

const main = async () => {
  const app = express();


  app.use(json());

  dotenv.config();
    

  try {
    await mongoose.connect(process.env.URI as string, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.error(e);
  }

  const server = app.listen(5000, () => {
    console.log("server running");
  });

process.on("SIGTERM", async () => {
        server.close((err)=> {
            console.log(err);
        })
        await mongoose.connection.close(true);
});
};

main();
