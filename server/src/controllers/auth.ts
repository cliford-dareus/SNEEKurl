// import { Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";
// import { Unauthenticated, BadRequest, NotFound } from "../lib/errors";
// import jwt from "jsonwebtoken";
// import User from "../models/user";

// const registerUser = async (req: Request, res: Response) => {
//   const { name, email, password } = req.body;

//   const isAlreadyExist = await User.find({ email });

//   if (isAlreadyExist.length > 0) {
//     throw new BadRequest("Email already exists");
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//   });

//   res.status(StatusCodes.CREATED).json(user);
// };

// const loginUser = async (req: Request, res: Response) => {
//   const { name, password } = req.body;

//   // 1- check if user already have a guest coookie
//   // 2- check if the guest coookie has document in database
//   // 3- if YES, update guest coookie with user coookie and id

//   if (!name || !password) {
//     throw new BadRequest("Please Provide a name and Password!");
//   }

//   const user = await User.findOne({ name });

//   if (!user) {
//     throw new Unauthenticated("Credentials Invalid");
//   }

//   const isPasswordCorrect = user.comparePassword(password);

//   if (!isPasswordCorrect) {
//     throw new BadRequest("Credentials Invalid");
//   }

//   const oneDay = 1000 * 60 * 60 * 24;
//   const accessTokenJWT = jwt.sign(
//     { userId: user._id, name: user.name },
//     process.env.JWT_SECRET!,
//     { expiresIn: oneDay }
//   );

//   res.cookie("accessToken", accessTokenJWT, {
//     signed: true,
//     httpOnly: true,
//     // expires: new Date(Date.now()) + oneDay
//   });

//   res.clearCookie("accessToken_not_login");

//   res
//     .status(StatusCodes.OK)
//     .json({ userName: user.name, userId: user._id, accessTokenJWT });
// };

// const logOutUser = async (req: Request, res: Response) => {
//   res.cookie("accessToken", "logout", {
//     httpOnly: true,
//     expires: new Date(Date.now()),
//   });

//   res.status(StatusCodes.OK).json({ msg: "user logged out!" });
// };

// export { registerUser, loginUser, logOutUser };
