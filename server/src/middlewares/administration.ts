import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

const administration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken, accessToken_not_login } = req.signedCookies;

  if (accessToken) {
    const { userId }: any = jwt.verify(accessToken, process.env.JWT_SECRET!);
    req.user = { login: userId };
    next();
  } else {
    const secret = nanoid(5);

    if (!accessToken_not_login) {
      const payload = jwt.sign({ guest: secret }, process.env.JWT_SECRET!);

      res.cookie("accessToken_not_login", payload, {
        signed: true,
        httpOnly: true,
        // expires: Date.now() + oneDay
      });

      req.user = { guest: secret };
      next();
    } else {
      const { guest }: any = jwt.verify(
        accessToken_not_login,
        process.env.JWT_SECRET!
      );

      req.user = { guest };
      next();
    }
  }
};

export default administration;
