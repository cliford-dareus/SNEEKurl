import { Request, Response } from "express";
import stripe from "../config/stripe";
import { StatusCodes } from "http-status-codes";
import User from "../models/user";

const retrieveSubscription = async (req: any, res: Response) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user)
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: "User not found",
    });

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

  const plan = await get_subscription_plan(plan_price);
  if (!plan)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Plan not found" });

  // Determine max_link based on plan price
  let maxLinks = 5; // Default free
  if (plan_price === 10) maxLinks = 100;   // Pro
  if (plan_price === 20) maxLinks = 1000;  // Premium

  let customer = await User.findOne({ username }).select(
    "stripe_account_id email",
  );
  if (!customer)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User not found" });

  const isCustomerIdValid = customer.stripe_account_id
    ? await stripe.customers.retrieve(customer.stripe_account_id as string)
    : false;

  if (!customer.stripe_account_id || isCustomerIdValid) {
    const newCustomer = await stripe.customers.create({
      email: customer.email,
    });
    const new_customer = await User.findByIdAndUpdate(
      { _id: customer._id },
      { $set: { stripe_account_id: newCustomer.id } },
      { new: true },
    );
    if (!new_customer)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Could not create new customer" });

    customer = new_customer;

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
            max_link: maxLinks, // Update max_link based on plan
          },
        },
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

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customer.stripe_account_id as string,
      items: [{ price: plan.id }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    await User.findByIdAndUpdate(
      { _id: customer._id },
      {
        $set: {
          subscription_end: subscription.current_period_end,
          max_link: maxLinks, // Update max_link based on plan
        },
      },
    );

    res.status(StatusCodes.OK).json({
      subscriptionId: subscription.id,
      // @ts-ignore
      client_secret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error: any) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: { message: error.message } });
  }
};

const updateSubscription = async (req: any, res: Response) => {
  const { subscriptionId, plan_price } = req.body;
  const user = req.user;

  const plan = await get_subscription_plan(plan_price);
  if (!plan)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Plan not found" });

  try {
    const customer = await User.findOne({ _id: user?._id }).select(
      "stripe_account_id",
    );
    if (!customer)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not found" });

    const isCustomerIdValid = await stripe.customers.retrieve(
      customer.stripe_account_id as string,
    );

    if (!customer.stripe_account_id || isCustomerIdValid.deleted === true)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Customer not found" });

    const subscription = await stripe.subscriptions.list({
      customer: customer.stripe_account_id,
      limit: 1,
      status: "active",
    });

    const usubscription = await stripe.subscriptions.update(
      subscription.data[0].id,
      {
        items: [
          {
            id: subscription.data[0].items.data[0].id,
            price: plan.id,
          },
        ],
      },
    );

    res.status(StatusCodes.OK).json({ usubscription });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: { message: error } });
  }
};

const get_subscription_plan = async (plan_price: number) => {
  const prices = await stripe.prices.list({
    lookup_keys: ["sneek_premium", "sneek_pro", "sneek_free"],
    expand: ["data.product"],
  });

  if (!prices) {
    return;
  }

  const plan = prices.data.find(
    (price) => price.unit_amount! / 100 === plan_price,
  );

  return plan;
};

export { create_subscription, retrieveSubscription, updateSubscription };
