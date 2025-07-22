import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/user";
import bcrypt from "bcrypt";
import { SendVerifyPasswordEmail } from "../lib/utils/send-verify-password-email";
import jwt from "jsonwebtoken";
import Short from "../models/short";
import stripe from "../config/stripe";
import Page from "../models/page";

const updateProfileImage = async (req: Request, res: Response) => {
  const { file } = req.body;
  const user = req.user;

  // @ts-ignore
  const isUserInDb = await User.findOne({ _id: user?._id });

  if (!isUserInDb)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "User not found" });

  try {
    await isUserInDb
      .updateOne({ _id: isUserInDb._id }, { $set: { profile: file } })
      .exec();
    res
      .status(StatusCodes.OK)
      .send({ message: "Profile image has been updated" });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: "" });
  }
};

const deleteProfileImage = async (req: Request, res: Response) => {};

const updateProfileDetails = async (req: Request, res: Response) => {
  const { username, email, oldpassword, newpassword } = req.body;
  const user = req.user;
  // @ts-ignore
  const isUserInDb = await User.findOne({ _id: user?._id });

  if (!isUserInDb)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "User not found" });

  if (!username && !email && !oldpassword && !newpassword)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "User not found" });

  try {
    if (oldpassword && newpassword) {
      const tenMinutes = 1000 * 60 * 10;
      const salt = await bcrypt.genSalt(10);
      const passwordToken = crypto.randomUUID();
      const o = jwt.sign(
        { oldpassword, newpassword },
        process.env.JWT_SECRET!,
        {
          expiresIn: tenMinutes,
        },
      );
      const hashPasswordToken = await bcrypt.hash(passwordToken, salt);

      await SendVerifyPasswordEmail({
        email: isUserInDb.email,
        name: isUserInDb.username,
        token: passwordToken,
        domain: "http://localhost:4080",
        o,
      });

      const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

      isUserInDb.passwordToken = hashPasswordToken;
      isUserInDb.username = username;
      isUserInDb.passwordTokenLife = passwordTokenExpirationDate;
      isUserInDb.save();

      return res
        .status(StatusCodes.OK)
        .send({ message: "Check your email to confirm changes..." });
    }

    await User.findOneAndUpdate(
      { _id: isUserInDb._id },
      {
        $set: {
          username,
          email,
        },
      },
    );

    return res
      .status(StatusCodes.OK)
      .send({ message: "Profile Successfully updated..." });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: "" });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { email, token, o } = req.query;

  if (!token || !email || !o) {
    res.status(StatusCodes.BAD_REQUEST).send();
  }

  const isUserInDb = await User.findOne({ email });

  const decoded_payload = jwt.verify(
    o as string,
    process.env.JWT_SECRET!,
  ) as jwt.JwtPayload;

  const newpassword = decoded_payload["newpassword"];

  try {
    if (isUserInDb) {
      const currentDate = new Date();
      const isTokenExpired = isUserInDb.passwordTokenLife! > currentDate;
      const isPasswordTokenCorrect = await bcrypt.compare(
        token as string,
        isUserInDb.passwordToken!,
      );

      if (isTokenExpired && isPasswordTokenCorrect) {
        isUserInDb.password = newpassword;
        isUserInDb.passwordToken = "";
        isUserInDb.passwordTokenLife = null;
        await isUserInDb.save();
      }

      return res
        .status(StatusCodes.OK)
        .send({ message: "Password Successfully updated..." });
    }
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: "" });
  }
};

const requestAccountDeletion = async (req: Request, res: Response) => {
  const user = req.user;

  try {
  } catch (error) {
    console.log(error);
  }
};

const deleteAccount = async (req: Request, res: Response) => {
  const user = req.user;

  try {
    // @ts-ignore
    const isUserInDb = await User.findOne({ _id: user?._id });

    if (!isUserInDb) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: "User not found" });
    }

    // Delete all user's short links
    await Short.deleteMany({ user: isUserInDb._id });

    // Delete all user's pages
    await Page.deleteMany({ user: isUserInDb._id });

    // Cancel Stripe subscription if exists
    if (isUserInDb.stripe_account_id) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: isUserInDb.stripe_account_id,
          status: "active",
        });

        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.cancel(subscription.id);
        }
      } catch (stripeError) {
        console.error("Error canceling Stripe subscription:", stripeError);
      }
    }

    // Delete the user account
    await User.findByIdAndDelete(isUserInDb._id);

    res.status(StatusCodes.OK).send({
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed to delete account"
    });
  }
};

const getUserLimits = async (req: any, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "User not authenticated"
      });
    }

    // Get current link count
    const linkCount = await Short.countDocuments({ user: user._id });

    let maxLinks = user.max_link || 5;
    let planName = "Free";
    let subscriptionStatus = "inactive";

    // Check Stripe subscription if user has stripe_account_id
    if (user.stripe_account_id) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripe_account_id,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          subscriptionStatus = subscription.status;

          const priceAmount = subscription.items.data[0]?.price?.unit_amount || 0;
          const priceInDollars = priceAmount / 100;

          // Determine plan based on price
          if (priceInDollars === 10) {
            maxLinks = 100;
            planName = "Pro";
          } else if (priceInDollars === 20) {
            maxLinks = 1000;
            planName = "Premium";
          }

          // Update user's cached limit if different
          if (user.max_link !== maxLinks) {
            await User.findByIdAndUpdate(user._id, { max_link: maxLinks });
          }
        }
      } catch (stripeError) {
        console.error("Stripe error in getUserLimits:", stripeError);
      }
    }

    res.status(StatusCodes.OK).json({
      limits: {
        links: {
          current: linkCount,
          limit: maxLinks,
          remaining: Math.max(0, maxLinks - linkCount)
        }
      },
      plan: {
        name: planName,
        subscriptionStatus
      }
    });

  } catch (error) {
    console.error("Get user limits error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to get user limits"
    });
  }
};

export {
  updateProfileImage,
  deleteProfileImage,
  updateProfileDetails,
  deleteAccount,
  resetPassword,
  getUserLimits
};
