// import { Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";
// import { BadRequest } from "../lib/errors/index";
// import Short from "../models/short";

// const getShortenUrl = async (req: Request, res: Response) => {
//   const { guest, userId } = req.user;

//   if (guest) {
//     const short = await Short.find({ creatorId: guest });
//     res.status(StatusCodes.OK).json(short);
//   } else if (userId) {
//     const short = await Short.find({ creatorId: userId });
//     res.status(StatusCodes.OK).json(short);
//   } else {
//     res.status(StatusCodes.NO_CONTENT).json([]);
//   }
// };

// // create short Url
// const shortenUrl = async (req: Request, res: Response) => {
//   const { longUrl } = req.body;
//   const { guest, login } = req.user;

//   if (!longUrl) {
//     throw new BadRequest("Enter a url to shorten");
//   }

//   if (guest) {
//     const short = await Short.create({
//       longUrl,
//       creatorId: guest,
//     });

//     res.status(StatusCodes.CREATED).json({ short, guest });
//     return;
//   }

//   const short = await Short.create({
//     longUrl,
//     isLogin: true,
//     creatorId: login,
//   });

//   res.status(StatusCodes.CREATED).json({ short });
// };

// const visitShort = async (req: Request, res: Response) => {
//   const clicksUrl = req.params.shortUrl;

//   const url = await Short.findOne({ short: clicksUrl });
//   if (url == null) return res.sendStatus(404);

//   await url.update({
//     clicks: (url.clicks = url.clicks + 1),
//   });

//   res.redirect(url.longUrl!);
// };

// const getShort = async (req: Request, res: Response) => {
//   const { favorite, clicks } = req.query;
//   const { userId } = req.user;
//   interface IShort {
//     favorite?: boolean;
//     clicks?: any;
//   }

//   let shortObj: IShort = {};

//   if (favorite) {
//     shortObj.favorite = favorite === "true" ? true : false;
//   }

//   if (clicks) {
//     shortObj.clicks = { $gt: Number(clicks) };
//   }

//   let short = await Short.find(shortObj);
//   res.status(StatusCodes.OK).send(short);
// };

// const updateShort = async (req: Request, res: Response) => {
//   const shortUrl = req.params.shortUrl;

//   const clicksUrl = await Short.findOne({ short: shortUrl });
//   if (clicksUrl == null) return res.status(StatusCodes.BAD_REQUEST);

//   await clicksUrl.update({
//     favorite: !clicksUrl.favorite,
//   });

//   res.status(StatusCodes.OK).json(clicksUrl);
// };

// const deleteShort = async (req: Request, res: Response) => {
//   const short = req.params.shortUrl;
//   console.log(short);
//   await Short.findOneAndDelete({ short: short });
//   res.status(StatusCodes.OK).json({ msg: "Short deleted" });
// };

// export {
//   getShortenUrl,
//   shortenUrl,
//   deleteShort,
//   visitShort,
//   getShort,
//   updateShort,
// };
