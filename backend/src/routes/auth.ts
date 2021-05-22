import { Router } from "express";
import User, { IUser } from "../models/user";
import validator from "validator";
import bcrypt from "bcrypt";
import { EncodeResult, Session } from "../auth/authTypes";
import {
  checkRefreshTokenValidity,
  encodeSession,
  generateRefreshToken,
} from "../auth/tokenUtils";
import { requireJwtMiddleware } from "../auth/middleware";

const authRouter: Router = Router();
export interface SignupRecord {
  email: IUser["email"];
  firstName: IUser["firstName"];
  lastName: IUser["lastName"];
  password: IUser["password"];
  username: IUser["username"];
}
export interface ErrorResponse {
  field : keyof SignupRecord,
  message : string
}
export interface LoginRecord {
  email: IUser["email"];
  password: IUser["password"];
}
export interface LoginResult {
  accessToken: EncodeResult;
  user: {
    email: IUser["email"];
    firstName: IUser["firstName"];
    lastName: IUser["lastName"];
    username: IUser["username"];
  };
}
authRouter.post("/signup", async (req, res) => {
  const record = req.body as SignupRecord;
  if (!record) {
    return res.status(401).json({ message: "json format wrong" });
  }
  if (!validator.isEmail(record.email)) {
    const error : ErrorResponse = { message: "email format wrong", field:"email" }
    return res.status(401).json(error);
  }
  if (!validator.isStrongPassword(record.password)) {
    const error : ErrorResponse = { message: "password is weak", field:"password" }
    return res.status(401).json(error);
  }
  let user = await User.findOne({ username: record.username });
  if (user) {
    const error : ErrorResponse = {  message: "username already exists", field:"username" }
    return res.status(401).json(error);
  }
  user = await User.findOne({ email: record.email });
  if (user) {
    const error : ErrorResponse = { message: "this email is already registered", field:"email" }
    return res.status(401).json(error);
  }
  const hash = await bcrypt.hash(record.password, 10);

  await User.create({
    email: record.email,
    firstName: record.firstName,
    lastName: record.lastName,
    password: hash,
    username: record.username,
  });
  return res
    .status(200)
    .json({ message: "user created succesfully. ready for login" });
});

authRouter.post("/login", async (req, res) => {
  const record = req.body as LoginRecord;
  if (!record) {
    return res.status(401).json({ message: "json format wrong" });
  }
  if (!validator.isEmail(record.email)) {
    const error : ErrorResponse = { message: "email format wrong", field:"email" }
    return res.status(401).json(error);
  }
  const user = await User.findOne({ email: record.email });
  if (!user) {
    return res.status(401).json({ message: "email or password is invalid" });
    // return res.json({ message: "email or password is invalid" });
  }
  const match = await bcrypt.compare(record.password, user.password);
  if (!match) {
    return res.status(401).json({ message: "email or password is invalid" });
    // return res.json({ message: "email or password is invalid" });
  }
  const session: Session = {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    issued: Date.now(),
    expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
  };
  const refreshToken = generateRefreshToken(
    process.env.REFRESH_KEY as string,
    session
  );
  const result: LoginResult = {
    accessToken: encodeSession(process.env.ACCESS_KEY as string, session),
    user: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    },
  };
  res.setHeader(
    "Set-Cookie", `refresh-token=${refreshToken.token}; HttpOnly; Max-Age=${
      365 * 24 * 60 * 60
    }`,
  );
  return res.status(200).json(result);
});

authRouter.post("/logout", requireJwtMiddleware, async (_req, res) => {
  res.setHeader(
    "Set-Cookie", `refresh-token=${""}; HttpOnly; Max-Age=${
      -1
    }`,
  );
  return res.status(200).json({message:"logged out successfully"});
});

authRouter.post("/renew", async (req, res) => {
  const token = req.cookies["refresh-token"]
  
  if (!token) {
    return res.status(401).json({ message: "fuck off" });
  }
  const expiryCheckResult = checkRefreshTokenValidity(
    process.env.REFRESH_KEY as string,
    token
  );

  if (expiryCheckResult.exp_status == "active") {
    const session = expiryCheckResult.session;
    session.issued = Date.now();
    session.expires = Date.now() + 15 * 60 * 1000;
    const encoded_session = encodeSession(
      process.env.ACCESS_KEY as string,
      session
    );
    const result: LoginResult = {
      accessToken: encoded_session,
      user: {
        email: session.email,
        lastName: session.lastName,
        firstName: session.firstName,
        username: session.username,
      },
    };
    session.expires = Date.now() + 365 * 24 * 60 * 60 * 1000;
    const refreshToken = generateRefreshToken(
      process.env.REFRESH_KEY as string,
      session
    );
    res.setHeader(
      "Set-Cookie", `refresh-token=${refreshToken.token}; HttpOnly; Max-Age=${
        365 * 24 * 60 * 60
      }`,
    );
    return res.status(200).json(result);
  }
});
export default authRouter;
