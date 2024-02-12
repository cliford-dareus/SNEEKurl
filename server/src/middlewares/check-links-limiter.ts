import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import stripe from "../config/stripe";
import Short from "../models/short";

const check_limiter_status = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user && !req.session.isAuthenticated) {
    console.log(user)
   return next();
  }

  const short = await Short.find({
    user: user?._id,
  });

  const subscription = await stripe.subscriptions.list({
    customer: user.stripe_account_id,
    status: "active",
  });

  // @ts-ignore
  const plan = subscription?.data[0]?.plan.metadata.max_link;

  if (short.length >= Number(plan)) {
    return res
      .status(StatusCodes.PAYMENT_REQUIRED)
      .send({ message: "Link reached limit" });
  }

  next();
};

export default check_limiter_status;
