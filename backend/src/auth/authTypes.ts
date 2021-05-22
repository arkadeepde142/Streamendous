import { IUser } from "../models/user";

export interface Session {
  id: IUser["_id"];
  email: IUser["email"];
  username: IUser["username"];
  firstName: IUser["firstName"];
  lastName: IUser["lastName"];
  /**
   * Timestamp indicating when the session was created, in Unix milliseconds.
   */
  issued: number;
  /**
   * Timestamp indicating when the session should expire, in Unix milliseconds.
   */
  expires: number;
}

/**
 * Identical to the Session type, but without the `issued` and `expires` properties.
 */
export type PartialSession = Omit<Session, "issued" | "expires">;

export interface EncodeResult {
  token: string;
  expires: Session["expires"];
  issued: Session["issued"];
}

export type DecodeResult =
  | {
      type: "valid";
      session: Session;
    }
  | {
      type: "integrity-error";
    }
  | {
      type: "invalid-token";
    };

export type ExpirationStatus = "expired" | "active";
export interface RefreshToken {
  token: string;
  expires: number;
}
