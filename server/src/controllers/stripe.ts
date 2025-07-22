import { Request, Response } from "express";
import stripe from "../config/stripe";
import { StatusCodes } from "http-status-codes";
import User from "../models/user";

const retrieveSubscription = async (req: any, res: Response) => {
  const { username } = req.params;

  if (!username) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Username is required",
    });
  }

  try {
    const user = await User.findOne({ username }).select("stripe_account_id");

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }

    if (!user.stripe_account_id) {
      return res.status(StatusCodes.OK).json({
        subscription: { data: [] }
      });
    }

    const subscription = await stripe.subscriptions.list({
      customer: user.stripe_account_id,
      limit: 1,
      status: "active",
    });

    res.status(StatusCodes.OK).json({ subscription });
  } catch (error: any) {
    console.error("Retrieve subscription error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: "Failed to retrieve subscription" }
    });
  }
};

const create_subscription = async (req: Request, res: Response) => {
  const { plan_price, username } = req.body;

  // Validate input
  if (!plan_price || !username) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Plan price and username are required",
    });
  }

  if (![0, 10, 20].includes(plan_price)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid plan price",
    });
  }

  try {
    const plan = await get_subscription_plan(plan_price);
    if (!plan) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Plan not found"
      });
    }

    // Determine max_link based on plan price
    const maxLinks = plan_price === 10 ? 100 : plan_price === 20 ? 1000 : 5;

    const user = await User.findOne({ username }).select(
      "stripe_account_id email _id"
    );

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found"
      });
    }

    let customerId = user.stripe_account_id;

    // Create or validate Stripe customer
    if (!customerId) {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user._id.toString() }
      });

      await User.findByIdAndUpdate(user._id, {
        stripe_account_id: newCustomer.id
      });

      customerId = newCustomer.id;
    } else {
      // Validate existing customer
      try {
        const existingCustomer = await stripe.customers.retrieve(customerId);
        if ('deleted' in existingCustomer && existingCustomer.deleted) {
          throw new Error("Customer was deleted");
        }
      } catch (error) {
        // Create new customer if validation fails
        const newCustomer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: user._id.toString() }
        });

        await User.findByIdAndUpdate(user._id, {
          stripe_account_id: newCustomer.id
        });

        customerId = newCustomer.id;
      }
    }

    // Check for existing active subscription
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (existingSubscriptions.data.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "User already has an active subscription",
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: plan.id }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        userId: user._id.toString(),
        planPrice: plan_price.toString(),
      }
    });

    // Update user limits
    await User.findByIdAndUpdate(user._id, {
      subscription_end: subscription.current_period_end,
      max_link: maxLinks,
    });

    const latestInvoice = subscription.latest_invoice as any;
    const paymentIntent = latestInvoice?.payment_intent;

    res.status(StatusCodes.OK).json({
      subscriptionId: subscription.id,
      client_secret: paymentIntent?.client_secret,
    });

  } catch (error: any) {
    console.error("Create subscription error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message || "Failed to create subscription" }
    });
  }
};

const updateSubscription = async (req: any, res: Response) => {
  const { subscriptionId, plan_price } = req.body;
  const user = req.user;

  if (!subscriptionId || !plan_price) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Subscription ID and plan price are required",
    });
  }

  if (![10, 20].includes(plan_price)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid plan price for update",
    });
  }

  try {
    const plan = await get_subscription_plan(plan_price);
    if (!plan) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Plan not found"
      });
    }

    const customer = await User.findById(user._id).select("stripe_account_id");
    if (!customer?.stripe_account_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "No Stripe customer found"
      });
    }

    // Verify customer exists and is not deleted
    const stripeCustomer = await stripe.customers.retrieve(customer.stripe_account_id);
    if ('deleted' in stripeCustomer && stripeCustomer.deleted) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Stripe customer not found"
      });
    }

    // Get current subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.stripe_account_id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No active subscription found"
      });
    }

    const currentSubscription = subscriptions.data[0];

    // Update subscription
    const updatedSubscription = await stripe.subscriptions.update(
      currentSubscription.id,
      {
        items: [{
          id: currentSubscription.items.data[0].id,
          price: plan.id,
        }],
        proration_behavior: "create_prorations",
      }
    );

    res.status(StatusCodes.OK).json({
      subscription: updatedSubscription
    });

  } catch (error: any) {
    console.error("Update subscription error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message || "Failed to update subscription" }
    });
  }
};

const get_subscription_plan = async (plan_price: number) => {
  try {
    const prices = await stripe.prices.list({
      lookup_keys: ["sneek_premium", "sneek_pro", "sneek_free"],
      expand: ["data.product"],
    });

    return prices.data.find(
      (price) => (price.unit_amount || 0) / 100 === plan_price
    );
  } catch (error) {
    console.error("Get subscription plan error:", error);
    return null;
  }
};

export { create_subscription, retrieveSubscription, updateSubscription };
