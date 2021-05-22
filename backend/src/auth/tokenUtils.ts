import { encode, TAlgorithm, decode } from "jwt-simple";
import {
  PartialSession,
  EncodeResult,
  Session,
  DecodeResult,
  ExpirationStatus,
  RefreshToken,
} from "./authTypes";

export function encodeSession(
  secretKey: string,
  partialSession: PartialSession
): EncodeResult {
  // Always use HS512 to sign the token
  const algorithm: TAlgorithm = "HS512";
  // Determine when the token should expire
  const issued = Date.now();
  const fifteenMinutesInMs = 15 * 60 * 1000;
  const expires = issued + fifteenMinutesInMs;
  const session: Session = {
    ...partialSession,
    issued: issued,
    expires: expires,
  };

  return {
    token: encode(session, secretKey, algorithm),
    issued: issued,
    expires: expires,
  };
}

export function decodeSession(
  secretKey: string,
  sessionToken: string
): DecodeResult {
  // Always use HS512 to decode the token
  const algorithm: TAlgorithm = "HS512";

  let result: Session;

  try {
    result = decode(sessionToken, secretKey, false, algorithm);
  } catch (_e) {
    const e: Error = _e;

    // These error strings can be found here:
    // https://github.com/hokaccha/node-jwt-simple/blob/c58bfe5e5bb049015fcd55be5fc1b2d5c652dbcd/lib/jwt.js
    if (
      e.message === "No token supplied" ||
      e.message === "Not enough or too many segments"
    ) {
      return {
        type: "invalid-token",
      };
    }

    if (
      e.message === "Signature verification failed" ||
      e.message === "Algorithm not supported"
    ) {
      return {
        type: "integrity-error",
      };
    }

    // Handle json parse errors, thrown when the payload is nonsense
    if (e.message.indexOf("Unexpected token") === 0) {
      return {
        type: "invalid-token",
      };
    }

    throw e;
  }

  return {
    type: "valid",
    session: result,
  };
}

export function checkExpirationStatus(token: Session): ExpirationStatus {
  const now = Date.now();

  if (token.expires > now) return "active";
  return "expired";
}

export function generateRefreshToken(secretKey:string, session: Session) : RefreshToken{
    // Always use HS512 to sign the token
    const algorithm: TAlgorithm = "HS512";
    return {
        token: encode(session, secretKey, algorithm),
        expires: Date.now() + (365*24*60*60*1000),
    }
}

export function checkRefreshTokenValidity(secretKey:string, token: string) : {exp_status: ExpirationStatus, session: Session} {
  const algorithm: TAlgorithm = "HS512";
  const decodedToken : Session = decode(token, secretKey, false, algorithm)
  if(decodedToken.expires > Date.now()){
    return {
      exp_status: "active",
      session: decodedToken
    }
  }
  return {
    exp_status: "expired",
    session: decodedToken
  }
}
