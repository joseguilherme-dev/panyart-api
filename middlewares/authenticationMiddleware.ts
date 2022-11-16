import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";

export async function isAuthenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*
   *      This middleware verifies if the user is authenticated using JWT stored in the cookies.
   */
  res.type("txt");

  // Reset information
  req.body.isAuthenticated = false;
  req.body.authenticatedId = undefined;

  console.log(req.cookies);

  if (!req.cookies.jwt) {
    req.body.isAuthenticated = false;
    return next();
  } else {
    const isJWTValid: any = await jwt.verify(
      req.cookies.jwt,
      SECRET_KEY,
      (err: any) => {
        if (err) return err;
        else return jwt.decode(req.cookies.jwt, SECRET_KEY);
      }
    );
    // If an error has not ocurred during the verification of JWT
    // that means the JWT is valid, and the user is properly authenticated:
    if (!isJWTValid.hasOwnProperty("name")) {
      // Errors has 'name' property on it, containing the error name.
      req.body.isAuthenticated = true;
      req.body.authenticatedId = isJWTValid.id;
      return next();
    } else {
      // If the token is simply invalid (made up or has expired) the user is not authenticated.
      res.clearCookie("jwt");
      req.body.isAuthenticated = false;
      return next();
    }
  }
}

export function authenticatedOnlyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.body.isAuthenticated)
    res.status(403).json({ msg: "Please login to execute this action." }).end();
  else return next();
}
