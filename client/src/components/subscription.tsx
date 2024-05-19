import Separator from "./ui/separator";
import { LuCheckCircle } from "react-icons/lu";
import Button from "./ui/button";
import { SubcriptionOptions } from "../Utils/common";
import {
  useRetrieveSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from "../app/services/stripe";
import { useUserPlan } from "./admin-layout";
import { useAppSelector } from "../app/hook";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

type Props = {};
const Subscription = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { data, refetch } = useRetrieveSubscriptionQuery();
  const [active_plan, setActivePlan] = useState<number | null>(null);
  const [updateSubscription, isLoading] = useUpdateSubscriptionMutation();

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
    if (!data?.subscription?.data?.length) return;
    const activePlan = data.subscription.data.find(
      (x: any) => x.status === "active"
    );
    setActivePlan(activePlan?.items.data[0]?.plan?.amount / 100 || null);
  }, [data]);

  return (
    <section className="rounded-md border">
      <div className="p-4">
        <h1 className="text-2xl font-medium">Subscription</h1>
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          {SubcriptionOptions.map((options, index) => (
            <div
              key={options.id + index}
              className="flex flex-col gap-4 rounded-md bg-slate-100 p-4 shadow shadow-slate-200"
            >
              <h2 className="text-2xl font-medium">{options.name}</h2>
              <p className="flex gap-1 text-4xl font-medium">
                ${options.price}
                <span className="text-xl font-normal">/months</span>
              </p>
              <Separator />
              <ul className="mb-auto">
                {options.perks.map((perk, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <LuCheckCircle className="h-4 w-4 text-slate-700" />
                    <p className="text-slate-700">{perk}</p>
                  </li>
                ))}
              </ul>

              {active_plan === options.price ? (
                <Button className="mt-4">Current Plan</Button>
              ) : (
                <Button
                  className="mt-4 bg-red-500 ring-2 ring-indigo-500"
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
