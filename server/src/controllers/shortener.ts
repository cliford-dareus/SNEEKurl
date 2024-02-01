import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequest } from "../lib/errors/index";
import Short from "../models/short";
import User from "../models/user";

// CREATE SHORTEN URL
const create = async (req: any, res: Response) => {
  const { longUrl } = req.body;
  const isAuthenticated = req.session.isAuthenticated as boolean;
  const clientId = req.session.client_id;

  const user = await User.findOne({ clientId });

  if (!user)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Enter a long URL" });

  if (!longUrl)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Enter a long URL" });

  const isUrlExist = await Short.findOne({ longUrl, user: user._id });
  if (isUrlExist) return res.status(StatusCodes.OK).json({ short: isUrlExist });

  if (isAuthenticated) {
    try {
      const short = await Short.create({
        longUrl,
        user: user?._id,
      });

      res.status(StatusCodes.OK).json({
        short,
      });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: "Smothing went wrong while creating short..." });
    }
  } else {
    const short = await Short.create({
      longUrl,
      user: user?._id,
    });

    await User.findByIdAndUpdate(user?._id, { freemium: user.freemium! - 1 });

    res.status(200).json({
      short,
    });
    try {
    } catch (error) {
      console.log(error);
    }
  }
};

export { create };
