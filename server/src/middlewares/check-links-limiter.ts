import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import stripe from "../config/stripe";
import Short from "../models/short";
import User from "../models/user";

const check_links_limiter_status = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  // Skip check for unauthenticated users (handled by guest limits)
  if (!user || !req.session.isAuthenticated) {
    return next();
  }

  try {
    // Get user's current link count
    const linkCount = await Short.countDocuments({
      user: user._id,
    });

    let maxLinks = user.max_link || 5; // Default free tier limit

    // Check if user has active subscription
    if (user.stripe_account_id) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripe_account_id,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          let planMetadata: any = undefined;
          const product = subscription.items.data[0]?.price?.product;
          if (product && typeof product === "object" && "metadata" in product) {
            planMetadata = (product as { metadata?: any }).metadata;
          }

          // Get limit from Stripe product metadata
          if (planMetadata?.max_link) {
            maxLinks = parseInt(planMetadata.max_link);
          } else {
            // Fallback: determine by price
            const priceAmount = subscription.items.data[0]?.price?.unit_amount || 0;
            maxLinks = getPlanLimitByPrice(priceAmount);
          }

          // Update user's max_link in database for caching
          if (user.max_link !== maxLinks) {
            await User.findByIdAndUpdate(user._id, { max_link: maxLinks });
          }
        }
      } catch (stripeError) {
        console.error("Stripe API error:", stripeError);
        // Use cached max_link from user model if Stripe fails
      }
    }

    // Check if user has reached their limit
    if (linkCount >= maxLinks) {
      return res.status(StatusCodes.PAYMENT_REQUIRED).json({
        message: "Link limit reached",
        current: linkCount,
        limit: maxLinks,
        plan: getPlanNameByLimit(maxLinks),
        upgradeRequired: true
      });
    }

    // Add limit info to request for frontend use
    req.linkLimits = {
      current: linkCount,
      limit: maxLinks,
      remaining: maxLinks - linkCount
    };

    next();
  } catch (error) {
    console.error("Link limiter error:", error);
    // On error, allow creation but log the issue
    next();
  }
};

// Helper function to determine plan limits by price
const getPlanLimitByPrice = (priceAmount: number): number => {
  const priceInDollars = priceAmount / 100;

  if (priceInDollars === 0) return 5;      // Free
  if (priceInDollars === 10) return 100;   // Pro
  if (priceInDollars === 20) return 1000;  // Premium

  return 5; // Default to free tier
};

// Helper function to get plan name by limit
const getPlanNameByLimit = (limit: number): string => {
  if (limit <= 5) return "Free";
  if (limit <= 100) return "Pro";
  if (limit <= 1000) return "Premium";
  return "Enterprise";
};

export default check_links_limiter_status;
