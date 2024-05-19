import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import stripe from "../config/stripe";
import Page from "../models/page";

const check_page_limiter_status = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user && !req.session.isAuthenticated) {
    console.log(user)
   return next();
  }

  const page = await Page.find({
    user: user?._id,
  });

  const subscription = await stripe.subscriptions.list({
    customer: user.stripe_account_id,
    status: "active",
  });

  // @ts-ignore
  const page_limiter = subscription?.data[0]?.plan.metadata.max_page;

  if (page.length >= Number(page_limiter)) {
    return res
      .status(StatusCodes.PAYMENT_REQUIRED)
      .send({ message: "Link reached limit" });
  }

  next();
};

export default check_page_limiter_status;
