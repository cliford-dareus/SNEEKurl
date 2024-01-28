import { NextFunction, Request, Response } from "express";
import { BadRequest, Unauthenticated } from "../lib/errors";
import jwt from "jsonwebtoken";

const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { accessToken, accessToken_not_login } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = jwt.verify(accessToken, process.env.JWT_SECRET!);

      req.user = payload;
      next();
    } else if (accessToken_not_login) {
      const payload = jwt.verify(
        accessToken_not_login,
        process.env.JWT_SECRET!
      );
      req.user = payload;
      next();
    } else {
      req.user = "no data";
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

export default authorize;
