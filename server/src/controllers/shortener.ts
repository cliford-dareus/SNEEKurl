import { Request, Response } from "express";
import geoip from "geoip-lite";
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

  if (isAuthenticated) {
    if (backhalf) {
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
    } else {
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
};

const getUrl = async (req: any, res: Response) => {
  const short = req.params.short;
  const url = await Short.findOne({ short });
  
  if (!url) {
    return res.status(StatusCodes.BAD_REQUEST)
    .send({ message: "Link does not exist" });
  }

  res.status(StatusCodes.OK).json({short: url, message: "Link found"});
};

// GET URLS SEARCH
const getUrls = async (req: any, res: Response) => {
  const { page, skip, sort, clicks, limit, search } = req.query;
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
    if (search) {
      const regex_search = { $regex: search, $options: "i" };
      const urls = await Short.find({
        user: user._id,
        longUrl: regex_search,
      });
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

const editUrl = async (req: Request, res: Response) => {
  const { id, longUrl, shortUrl, isShareable } = req.body;
  const password = req.body.password ?? undefined;

  const url = await Short.findById(id);
  if (!url) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Link does not exist" });
  }

  const update = {
    $set: { longUrl, shortUrl, isShareable },
    $unset: password ? undefined : { password: "" },
  };

  try {
    await Short.findByIdAndUpdate(id, update);
    const message = password
      ? "Link updated"
      : "Link updated (password removed)";
    res.status(StatusCodes.OK).send({ message });
  } catch {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Link could not be updated" });
  }
};

const visitUrl = async (req: Request, res: Response) => {
  const shortUrl = req.params.short;
  const providedPassword = req.query.password;

  const url = await Short.findOne({ short: shortUrl });

  if (!url) {
    return res.sendStatus(StatusCodes.BAD_REQUEST);
  }

  // const ipAddress = req.headers["x-forwarded-for"]
  const ipAddress = req.socket.remoteAddress;
  const geo = geoip.lookup(ipAddress as string);

  const metadata = {
    time: new Date(),
    userAgent: req.headers["user-agent"],
    referer: req.headers.referer,
    country: geo?.country || "Unknown",
  };

  console.log(metadata);

  try {
    if (url.password && !providedPassword) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .send(`Link is protected by password`);
    } else if (url.password && providedPassword) {
      const isCorrectPassword = providedPassword === url.password;
      if (isCorrectPassword) {
        await Short.updateOne(
          { _id: url._id },
          {
            $inc: { clicks: 1 },
            $set: { lastClick: Date.now() },
            $push: { metadata },
          }
        );
        return res.redirect(url.longUrl);
      }
    } else {
      await Short.updateOne(
        { _id: url._id },
        {
          $inc: { clicks: 1 },
          $set: { lastClick: Date.now() },
          $push: { metadata },
        }
      );
      return res.redirect(url.longUrl);
    }
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Smothing went wrong!" });
  }
};

export { create, getUrls, editUrl, visitUrl, getUrl };
