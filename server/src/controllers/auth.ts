import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { jwt_compare } from "../lib/utils/jwt";
import Short from "../models/short";

const register = async (req: any, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Please provide an username and password..." });

  try {
    const exist = await User.findOne({ email });
    if (exist) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Bad credentials..." });
    }

    const done = await User.findOneAndDelete({
      clientId: req.session.client_id,
    });

    const user = await User.create({
      username,
      password,
      email,
      clientId: req.session.client_id,
      freemium: done?.freemium,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "User created", user: { username: user.username } });
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY);
  }
};

const login = async (req: any, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Please provide an username and password..." });

  try {
    const user = await User.findOne({ username });

    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Bad credentials..." });

    const isPasswordCorrect = await jwt_compare(password, user.password);

    if (!isPasswordCorrect)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Bad credentials..." });

    const payload = jwt.sign(
      { user_id: user._id, user_name: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    res.cookie("auth.sid", payload, {
      httpOnly: true,
      signed: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // res.clearCookie("guest.sid");
    req.session.isAuthenticated = true;
    // ++++++++++++++++++++++++++++++++++++++++++++
    if (req.session.client_id !== user.clientId) {
      await User.findOneAndDelete({ clientId: req.session.client_id });
      // const updatedUser = await user
      //   .updateOne({ clientId: req.session.client_id })
      //   .exec();
      // req.session.client_id = updatedUser.clientId;
    }

    res.status(StatusCodes.OK).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        stripe_account_id: user.stripe_account_id,
        isVerified: true,
      },
      token: payload,
    });

    const guest_sid = req.signedCookies["guest.sid"];
    const guest_id = jwt.verify(
      guest_sid,
      process.env.JWT_SECRET!,
    ) as jwt.JwtPayload;

    try {
      const shorts = await Short.find({
        guest: guest_id.client_id,
      });

      if (shorts) {
        shorts.forEach(async (short) => {
          await Short.findOneAndUpdate(
            { _id: short._id },
            { user: user._id, $unset: { guest: "", expired_in: "" } },
          );
        });

        res
          .status(StatusCodes.OK)
          .json({ message: "Successful Save Short..." });
      }
    } catch (error) {}
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error });
  }
};

const logout = async (req: any, res: Response) => {
  // req.session.resetMaxAge()
  req.session.isAuthenticated = false;
  res.clearCookie("auth.sid");
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

export { register, login, logout };
