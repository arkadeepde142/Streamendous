import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

const UserSchema: mongoose.Schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true , index: true},
  username: { type: String, required: true, unique: true , index: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
