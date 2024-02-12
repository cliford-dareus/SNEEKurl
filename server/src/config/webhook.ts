import { BodyParser } from "body-parser";
import { Express, Request, Response } from "express";
import stripe from "./stripe";

export const webhook = (app: Express, bodyParser: BodyParser) => {
  app.post(
    "/webhook",
    bodyParser.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          req.header("Stripe-Signature") as string,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
      } catch (err) {
        console.log(err);
        console.log(`⚠️  Webhook signature verification failed.`);
        console.log(
          `⚠️  Check the env file and enter the correct webhook secret.`
        );
        return res.sendStatus(400);
      }

      // Extract the object from the event.
      const dataObject = event.data.object;

      // Handle the event
      // Review important events for Billing webhooks
      // https://stripe.com/docs/billing/webhooks
      // Remove comment to see the various objects sent for this sample
      switch (event.type) {
        case "invoice.payment_succeeded":
            //@ts-ignore
          if (dataObject["billing_reason"] == "subscription_create") {
            // The subscription automatically activates after successful payment
            // Set the payment method used to pay the first invoice
            // as the default payment method for that subscription
            //@ts-ignore
            const subscription_id = dataObject["subscription"];
            //@ts-ignore
            const payment_intent_id = dataObject["payment_intent"];

            // Retrieve the payment intent used to pay the subscription
            const payment_intent = await stripe.paymentIntents.retrieve(
              payment_intent_id
            );

            try {
              const subscription = await stripe.subscriptions.update(
                subscription_id,
                {
                  //@ts-ignore
                  default_payment_method: payment_intent.payment_method,
                }
              );

              console.log(
                "Default payment method set for subscription:" +
                  payment_intent.payment_method
              );
            } catch (err) {
              console.log(err);
              console.log(
                `⚠️  Falied to update the default payment method for subscription: ${subscription_id}`
              );
            }
          }

          break;
        case "invoice.payment_failed":
          // If the payment fails or the customer does not have a valid payment method,
          //  an invoice.payment_failed event is sent, the subscription becomes past_due.
          // Use this webhook to notify your user that their payment has
          // failed and to retrieve new card details.
          break;
        case "invoice.finalized":
          // If you want to manually send out invoices to your customers
          // or store them locally to reference to avoid hitting Stripe rate limits.
          break;
        case "customer.subscription.deleted":
          if (event.request != null) {
            // handle a subscription cancelled by your request
            // from above.
          } else {
            // handle subscription cancelled automatically based
            // upon your subscription settings.
          }
          break;
        case "customer.subscription.trial_will_end":
          // Send notification to your user that the trial will end
          break;
        default:
        // Unexpected event type
      }
      res.sendStatus(200);
    }
  );
};
