import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequest } from "../lib/errors/index";
import Short from "../models/short";
import User from "../models/user";

// CREATE SHORTEN URL
const create = async (req: any, res: Response) => {
  const { longUrl, backhalf } = req.body;
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

  if (backhalf) {
    if (isAuthenticated) {
      try {
        const short = await Short.create({
          longUrl,
          short: backhalf,
          user: user?._id,
        });

        await User.findByIdAndUpdate(user?._id, {
          max_link: user.max_link! - 1,
        });

        res.status(StatusCodes.OK).json({
          short,
        });
      } catch (error) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: "Smothing went wrong while creating short..." });
      }
    }
  } else {
    if (isAuthenticated) {
      try {
        const short = await Short.create({
          longUrl,
          user: user?._id,
        });

        await User.findByIdAndUpdate(user?._id, {
          max_link: user.max_link! - 1,
        });

        res.status(StatusCodes.OK).json({
          short,
        });
      } catch (error) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: "Something went wrong while creating short..." });
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
    }
  }
};

// GET URLS SEARCH
const getUrls = async (req: any, res: Response) => {
  const { page, skip, sort, clicks, limit = 5, search } = req.query;
  const client_id = req.session.client_id;

  const user = await User.findOne({ clientId: client_id });

  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Something went wrong ... " });
  }

  const clickOptions = {
    most_click: "desc",
    less_click: "asc",
  };
  // @ts-ignore
  const clickOption = clicks ? clickOptions[clicks] : "";

  try {
    if(search){
      const regex_search = {$regex: search, $options: 'i'}
      const urls = await Short.find(
          {
            user: user._id,
            longUrl: regex_search
          }
      )
      return res.status(StatusCodes.OK).json({ urls });
    }

    const urls = await Short.find({ user: user._id })
      .limit(limit)
      .sort({
        createdAt: sort,
        clicks: clickOption,
      })
      .exec();

    res.status(StatusCodes.OK).json({ urls });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Smothing went wrong!" });
  }
};

// UPDATE/EDIT URLS
const editUrl = async (req: Request, res: Response) => {
  const { id, longUrl, short, password, isShareable } = req.body;

  const shortExit = await Short.findById(id);
  if (!shortExit) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Link does not exit" });
  }

  try {
    if (password) {
      await Short.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            longUrl,
            short,
            password,
            isShareable,
          },
        }
      );

      return res
        .status(StatusCodes.OK)
        .send({ message: "Link has been updated" });
    }

    await Short.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          longUrl,
          short,
          isShareable,
        },
        $unset: {
          password,
        },
      }
    );

    res.status(StatusCodes.OK).send({ message: "Link has been updated" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Link could not be updated" });
  }
};

const visitUrl = async (req: Request, res: Response) => {
  const clicksUrl = req.params.short;
  const { password } = req.query;

  const url = await Short.findOne({ short: clicksUrl });

  if (url == null)
    return res
      .sendStatus(StatusCodes.BAD_REQUEST)
      .send({ message: "Link not found..." });

  try {
    if (url.password && !password) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .send(`link is protected by with password`);
    } else if (url.password && password) {
      const isCorrectPassword = password === url.password;
      if (isCorrectPassword) {
        await url
          .updateOne({ $inc: { clicks: 1 }, $set: { lastClick: Date.now() } })
          .exec();

        return res.redirect(url.longUrl);
      }
    } else {
      await url
        .updateOne({ $inc: { clicks: 1 }, $set: { lastClick: Date.now() } })
        .exec();

      return res.redirect(url.longUrl);
    }
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Smothing went wrong!" });
  }
};

export { create, getUrls, editUrl, visitUrl };
