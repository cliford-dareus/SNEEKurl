import { Request, Response } from "express";
import Page from "../models/page";
import User from "../models/user";
import { StatusCodes } from "http-status-codes";

const getMyPages = async (req: any, res: Response) => {
  const client_id = req.session.client_id;
  const user = await User.findOne({ clientId: client_id });

  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Something went wrong ... " });
  }
  try {
    const pages = await Page.find({ user: user._id });
    res.status(200).json(pages);
  } catch (e) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Something went wrong..." });
  }
};

const createPage = async (req: any, res: Response) => {
  const { title, description, slug, isPublic } = req.body;
  const client_id = req.session.client_id;

  const user = await User.findOne({ clientId: client_id }, { _id: 1 });
  if (!user) return res.sendStatus(StatusCodes.BAD_REQUEST);

  const isUnique = await Page.findOne({ slug }).select("_id");
  if (isUnique)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "This slug is already in use" });

  const page = new Page({ title, description, slug, user: user._id, isPublic });
  try {
    await page.save();
    res.status(StatusCodes.OK).json(page);
  } catch (e) {
    console.error(e);
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
};

const updatePage = async (req: any, res: Response) => {
  const { id, title, description, slug, isPublic, links, category } = req.body;
  const client_id = req.session.client_id;

  if (!title && !description && !slug && !isPublic && !links) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide a title, description, slug, isPublic and links",
    });
  }

  const user = await User.findOne({ clientId: client_id }, { _id: 1 });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid user" });
  }

  const page = await Page.findById(id).populate("links.link");
  if (!page) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Page not found" });
  }

  const allLinks = [...page.links, ...links];

  const formatedLinks = allLinks.reduce((acc, link) => {
    if (typeof link === "object") {
      acc = [...acc, { _id: link._id, category: link.category }];
    } else {
      acc = [...acc, { _id: link, category: category ? category : "website" }];
    }
    return acc;
  }, [] as unknown as { _id: string; catetory: string }[]);

  const uniqueAges = formatedLinks
    .map((item: any) => item)
    .filter((value: any, index: number, self: any) => {
      if (self.indexOf(value) === index) {
        return self[index];
      }
    });

  const updateOps: Record<string, unknown> = {};

  if (title) updateOps.title = title;
  if (description) updateOps.description = description;
  if (slug) updateOps.slug = slug;
  if (isPublic !== undefined) updateOps.isPublic = isPublic;
  if (Object.keys(updateOps).length > 0) page.set(updateOps);

  page.links = uniqueAges;
  await page.save();
  res.status(StatusCodes.OK).json(page);
};

const getPage = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const page = await Page.findOne({ slug })
    .populate({ path: "user", model: "User", select: ["username", "profile"] })
    .populate({ path: "links._id", model: "Short" })
    .exec();

  if (!page) {
    return res.sendStatus(StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.OK).json(page);
};

const managePage = async (req: any, res: Response) => {
  const { slug } = req.params;
  const newOrder = req.body;

  const page = await Page.findOne({ slug });
  if (!page) {
    return res.sendStatus(StatusCodes.BAD_REQUEST);
  }

  page.links = newOrder;
  await page.save();

  res.status(StatusCodes.OK).json(page);
};

export { getMyPages, createPage, updatePage, getPage, managePage };
