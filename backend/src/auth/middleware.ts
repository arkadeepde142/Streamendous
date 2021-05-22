import { Request, Response, NextFunction } from "express";
import {
    Session,
    DecodeResult,
    ExpirationStatus,
  } from "./authTypes";
import {checkExpirationStatus, decodeSession } from "./tokenUtils"
/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
export function requireJwtMiddleware(request: Request, response: Response, next: NextFunction) {
    const unauthorized = (message: string) => response.status(401).json({
        ok: false,
        status: 401,
        message: message
    });

    // const requestHeader = "X-JWT-Token";
    // const header = request.header(requestHeader);
    
    // if (!header) {
    //     unauthorized(`Required ${requestHeader} header not found.`);
    //     return;
    // }
    const token = request.headers.authorization?.split(" ")[1]
    if (!token) {
        unauthorized(`Required authorisation header not found.`);
        return;
    }
    const decodedSession: DecodeResult = decodeSession(process.env.ACCESS_KEY as string, token);
    
    if (decodedSession.type === "integrity-error" || decodedSession.type === "invalid-token") {
        unauthorized(`Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`);
        return;
    }

    const expiration: ExpirationStatus = checkExpirationStatus(decodedSession.session);

    if (expiration === "expired") {
        unauthorized(`Authorization token has expired. Please create a new authorization token.`);
        return;
    }

    let session: Session;
    session = decodedSession.session;

    // Set the session on response.locals object for routes to access
    response.locals = {
        ...response.locals,
        session: session
    };

    // Request has a valid or renewed session. Call next to continue to the authenticated route handler
    next();
}