import Separator from "./ui/separator";
import { LuCheckCircle } from "react-icons/lu";
import Button from "./ui/button";
import { SubcriptionOptions } from "../Utils/common";
import {
  useCreateSubscriptionMutation,
  useRetrieveSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from "../app/services/stripe";
import { useAppSelector } from "../app/hook";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPlan } from "./layout/admin-layout";

type Props = {};

const Subscription = () => {
  const Navigate = useNavigate();
  const plan = useUserPlan()
  const user = useAppSelector((state) => state.auth.user);
  const [active_plan, setActivePlan] = useState<number | null>(null);
  const [updateSubscription, isLoading] = useUpdateSubscriptionMutation();
  const [create_subscription] = useCreateSubscriptionMutation();
  const { data } = useRetrieveSubscriptionQuery(
    { username: user.username },
    { skip: !user.username },
  );
  const [subscriptionData, setSubscriptionData] = useState<{
    subscriptionId: string;
    client_secret: string;
  } | null>(null);

  const handleSubscription = useCallback(
    async (price: number) => {
      const payload = { plan_price: price, username: user.username };
      try {
        const subscription = await create_subscription(payload).unwrap();
        const { subscriptionId, client_secret } = subscription;
        setSubscriptionData({ subscriptionId, client_secret });
      } catch (error) {
        console.log(error);
      }
    },
    [create_subscription, user.username],
  );

  const handleUpdateSubscription = async (price: number) => {
    try {
      await updateSubscription({
        plan_price: price,
        subscriptionId: user.stripe_account_id,
      }).unwrap();
      toast.success("Subscription updated successfully");
    } catch (error) {
      toast.error("Subscription update failed");
    }
  };

  useEffect(() => {
    if (subscriptionData) {
      Navigate("/pricing/checkout", { state: subscriptionData });
    }
  }, [subscriptionData]);

  useEffect(() => {
    if (data?.subscription?.data?.length === 0) {
      setActivePlan(null);
      return;
    }

    const activePlan = data?.subscription?.data.find(
      (x: any) => x.status === "active",
    );
    setActivePlan(activePlan?.items.data[0]?.plan?.amount / 100 || null);
  }, [data]);

  return (
    <section className="rounded-md border border-base-300">
      <div className="p-4">
        <h1 className="text-2xl font-medium">Subscription</h1>
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          {pricingPlans.map((options, index) => (
            <div
              key={options.id + index}
              className="flex flex-col gap-4 rounded-md bg-base-200 p-4 shadow shadow-base-300"
            >
              <h2 className="text-2xl font-medium">{options.name}</h2>
              <p className="flex gap-1 text-4xl font-medium">
                ${options.price}
                <span className="text-xl font-normal">/months</span>
              </p>
              <Separator />
              <ul className="mb-auto">
                {options.features.map((perk, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <LuCheckCircle className="h-4 w-4 text-accent" />
                    <p className="text-accent">{perk}</p>
                  </li>
                ))}
              </ul>

              {active_plan === null ? (
                <Button
                  className="mt-4"
                  onClick={() => handleSubscription(options.price)}
                >
                  Subscribe
                </Button>
              ) : active_plan === options.price ? (
                <Button className="mt-4">Current Plan</Button>
              ) : (
                <Button
                  className="mt-4 bg-primary ring-2 ring-primary"
                  onClick={() => {
                    if (
                      user.username !== "Guest" &&
                      active_plan !== options.price
                    ) {
                      handleUpdateSubscription(options.price);
                    }
                  }}
                >
                  Update Plan
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Subscription;
