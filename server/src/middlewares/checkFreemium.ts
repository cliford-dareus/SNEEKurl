import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import passport from "passport";
import { StatusCodes } from "http-status-codes";

const isFreemiumDone = async (req: any, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: true },
    async (err: any, result: any) => {
      if (err) {
        console.log(err);
      }

      const clientId = req.session.client_id;
      const user = await User.findOne({ clientId });

      if (!result) {
        try {
          if (!user)
            res
              .status(StatusCodes.BAD_REQUEST)
              .send({ message: "User not found" });

          if (user?.freemium! <= 0)
            return res
              .status(StatusCodes.OK)
              .send({ message: "Freemium is done" });
              
          req.user = user;
          next();
        } catch (error) {
          console.log(error);
        }
      } else {
        req.user = user;
        next();
      }
    }
  )(req, res, next);
};

export default isFreemiumDone;
