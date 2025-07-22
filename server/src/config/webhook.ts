import { BodyParser } from "body-parser";
import { Express, Request, Response } from "express";
import stripe from "./stripe";
import User from "../models/user";

export const webhook = (app: Express, bodyParser: BodyParser) => {
  app.post(
    "/webhook",
    bodyParser.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.header("Stripe-Signature");
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!sig || !webhookSecret) {
        console.log("⚠️ Missing webhook signature or secret");
        return res.status(400).send("Missing signature or secret");
      }

      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.log(`⚠️ Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      try {
        await handleWebhookEvent(event);
        res.status(200).send("Webhook handled successfully");
      } catch (error: any) {
        console.error("Webhook handling error:", error);
        res.status(500).send("Webhook handling failed");
      }
    }
  );
};

const handleWebhookEvent = async (event: any) => {
  const dataObject = event.data.object;

  switch (event.type) {
    case "invoice.payment_succeeded":
      await handlePaymentSucceeded(dataObject);
      break;

    case "invoice.payment_failed":
      await handlePaymentFailed(dataObject);
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(dataObject);
      break;

    case "customer.subscription.updated":
      await handleSubscriptionUpdated(dataObject);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

const handlePaymentSucceeded = async (invoice: any) => {
  if (invoice.billing_reason === "subscription_create") {
    const subscriptionId = invoice.subscription;
    const paymentIntentId = invoice.payment_intent;

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      await stripe.subscriptions.update(subscriptionId, {
        default_payment_method: paymentIntent.payment_method as string,
      });

      console.log(`Default payment method set for subscription: ${subscriptionId}`);
    } catch (error) {
      console.error(`Failed to update default payment method: ${error}`);
    }
  }

  // Update user subscription status
  if (invoice.customer) {
    await updateUserSubscriptionStatus(invoice.customer, "active");
  }
};

const handlePaymentFailed = async (invoice: any) => {
  console.log(`Payment failed for customer: ${invoice.customer}`);

  if (invoice.customer) {
    await updateUserSubscriptionStatus(invoice.customer, "past_due");
  }
};

const handleSubscriptionDeleted = async (subscription: any) => {
  console.log(`Subscription deleted: ${subscription.id}`);

  if (subscription.customer) {
    await updateUserSubscriptionStatus(subscription.customer, "canceled");
  }
};

const handleSubscriptionUpdated = async (subscription: any) => {
  console.log(`Subscription updated: ${subscription.id}`);

  if (subscription.customer) {
    const status = subscription.status;
    await updateUserSubscriptionStatus(subscription.customer, status);
  }
};

const updateUserSubscriptionStatus = async (customerId: string, status: string) => {
  try {
    const user = await User.findOne({ stripe_account_id: customerId });

    if (user) {
      const updateData: any = { subscription_status: status };

      if (status === "canceled" || status === "incomplete_expired") {
        updateData.max_link = 5; // Reset to free plan
        updateData.subscription_end = null;
      }

      await User.findByIdAndUpdate(user._id, updateData);
      console.log(`Updated user ${user.username} subscription status to: ${status}`);
    }
  } catch (error) {
    console.error("Error updating user subscription status:", error);
  }
};
