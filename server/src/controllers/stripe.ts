import { Request, Response } from "express";
import stripe from "../config/stripe";
import { StatusCodes } from "http-status-codes";
import User from "../models/user";

const retrieveSubscription = async (req: any, res: Response) => {
  const clientId = req.session.client_id;

  const user = await User.findOne({ clientId });

  if (!user) return res.status(StatusCodes.BAD_REQUEST).send();
  try {
    const subscription = await stripe.subscriptions.list({
      customer: user.stripe_account_id,
    });

    res.status(StatusCodes.OK).send({ subscription });
  } catch (error: any) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: { message: error.message } });
  }
};

const create_subscription = async (req: Request, res: Response) => {
  const { plan_price, username } = req.body;
  let plan;

  try {
    const prices = await stripe.prices.list({
      lookup_keys: ["sneek_premium", "sneek_pro", "sneek_free"],
      expand: ["data.product"],
    });

    if (!prices) {
      return res.status(StatusCodes.BAD_REQUEST).send({ message: "" });
    }
    const choosing_plan = prices.data.filter(
      (price) => price.unit_amount! / 100 === plan_price
    );

    plan = choosing_plan[0];
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send();
  }

  const customer = await User.findOne({ username });
  console.log(customer)

  if (!customer?.stripe_account_id) {
    // create a new customer in stripe
    const newCustomer = await stripe.customers.create({
      email: customer?.email,
    });

    const new_customer = await User.findByIdAndUpdate(
      { _id: customer?._id },
      {
        $set: {
          stripe_account_id: newCustomer.id,
        },
      }
    );

    if (!new_customer) return res.status(StatusCodes.BAD_REQUEST).send();

    try {
      const subscription = await stripe.subscriptions.create({
        customer: new_customer.stripe_account_id as string,
        items: [
          {
            price: plan?.id,
          },
        ],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });

      await User.findByIdAndUpdate(
        { _id: customer?._id },
        {
          $set: {
            subscription_end: subscription.current_period_end,
            max_link: plan?.metadata.max_link,
          },
        }
      );

      res.status(StatusCodes.OK).send({
        subscriptionId: subscription.id,
        // @ts-ignore
        client_secret: subscription.latest_invoice.payment_intent.client_secret,
      });
    } catch (error: any) {
      return res.status(400).send({ error: { message: error.message } });
    }
  }

  // create subscription
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customer?.stripe_account_id as string,
      items: [
        {
          price: plan?.id,
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    await User.findByIdAndUpdate(
      { _id: customer?._id },
      {
        $set: {
          subscription_end: subscription.current_period_end,
          max_link: plan?.metadata.max_link,
        },
      }
    );

    res.status(StatusCodes.OK).send({
      subscriptionId: subscription.id,
      // @ts-ignore
      client_secret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error: any) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: { message: error.message } });
  }
};

export { create_subscription, retrieveSubscription };
