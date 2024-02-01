import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Unauthenticated, BadRequest, NotFound } from "../lib/errors";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { jwt_compare } from "../config/jwt";

const register = async (req: any, res: Response) => {
  const session_sid = req.signedCookies["session.sid"];
  const { username, email, password } = req.body;

  try {
    const exist = await User.findOne({ email });
    // const guest_account = await User.findOne({
    //   clientId: req.session.client_id,
    // });
    if (exist) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Bad credentials..." });
    }

    const done = await User.findOneAndDelete({ clientId: req.session.client_id });
    const user  = await User.create({
        username,
        password,
        email,
        clientId: req.session.client_id,
        freemium: done?.freemium 
    })

    res
      .status(StatusCodes.CREATED)
      .json({ message: "User created", user: { username: user.username } });
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY);
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // 1- check if user already have a guest coookie
  // 2- check if the guest coookie has document in database
  // 3- if YES, update guest coookie with user coookie and id

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
      { expiresIn: "1d" }
    );

    res.cookie("auth.sid", payload, {
      httpOnly: true,
      signed: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.ACCEPTED).json({
      message: "Login successful",
      user: {
        username: user.username,
      },
    });
  } catch (error) {}
};

const logout = async (req: Request, res: Response) => {
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

export { register, login, logout };
