import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import passport from "passport";

const isFreemiumDone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session_sid = req.signedCookies["session.sid"];
  const auth_sid = req.signedCookies["auth.sid"];

  passport.authenticate(
    "jwt",
    { session: false },
    async (err: any, result: any) => {
      if (err) {
        console.log(err);
      }

      if (!result) {
        try {
          const user = await User.findOne({ clientId: session_sid });

          if (!user) res.status(404).send();
    
          if (user?.freemium == 0)
            return res.status(200).send({ message: "Freemium is done" });

          next();
        } catch (error) {
          console.log(error);
        }
      } else {
        req.user = result.user;
        next();
      }
    }
  )(req, res, next);
};

export default isFreemiumDone;
