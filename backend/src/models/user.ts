import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  firstName: string;
  lastName: string;
}

const UserSchema: mongoose.Schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
