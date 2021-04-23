import mongoose from "mongoose";
import { IUser } from "./user";

export interface IVideo extends mongoose.Document {
    title : string,
    description : string,
    owner : IUser['_id']
}
const VideoSchema: mongoose.Schema = new mongoose.Schema(
  {
      title : { type: String, required: true},
      description : {type : String, required : false},
      owner : {type : mongoose.Schema.Types.ObjectId, required : true}
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IVideo>("Video", VideoSchema);
