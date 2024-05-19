import { useCallback, useEffect, useState } from "react";
import Button from "../components/ui/button";
import classNames from "classnames";
import { useAppSelector } from "../app/hook";
import { Outlet, useNavigate } from "react-router-dom";
import {
  useCreateSubscriptionMutation,
  useRetrieveSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from "../app/services/stripe";
import { SubcriptionOptions } from "../Utils/common";
import { toast } from "react-toastify";

type Props = {};

const Pricing = () => {
  const { data, refetch } = useRetrieveSubscriptionQuery();
  const Navigate = useNavigate();
  const [create_subscription, { isLoading }] = useCreateSubscriptionMutation();
  const [update_subscription, { isLoading: updateLoading }] =
    useUpdateSubscriptionMutation();
  const [activeplan, setActivePlan] = useState<number | null>(null);
  const { user } = useAppSelector((state) => state.auth);
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
    [create_subscription, user.username]
  );

  const handleUpdateSubscription = useCallback(
    async (price: number) => {
      try {
        await update_subscription({
          plan_price: price,
          subscriptionId: user.stripe_account_id,
        }).unwrap();
        toast.success("Subscription updated successfully");
      } catch (error) {
        toast.error("Subscription update failed");
      }
    },
    [update_subscription, user.stripe_account_id]
  );

  useEffect(() => {
    if (subscriptionData) {
      Navigate("checkout", { state: subscriptionData });
    }
  }, [subscriptionData, Navigate]);

  useEffect(() => {
    if (!data?.subscription?.data?.length) return;
    const activePlan = data.subscription.data.find(
      (x: any) => x.status === "active"
    );
    setActivePlan(activePlan?.items.data[0]?.plan?.amount / 100 || null);
  }, [data]);

  return (
    <>
      <section className="container relative mx-auto flex flex-col justify-center p-4 text-center text-black dark:text-white">
        <div className="mt-16">
          <h1 className="mx-auto mt-5 text-7xl text-black max-w-[700px] dark:text-white">
            Prices small, connect big!
          </h1>
          <p className="mt-4">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam,
            quos?
          </p>
        </div>

        <div className="mx-auto mt-16 flex w-full gap-4 text-left max-w-[1000px]">
          {SubcriptionOptions.map((opt) => (
            <div
              key={opt.id}
              className={classNames(
                "flex-1 p-4 rounded-lg shadow-lg",
                opt.popular ? "bg-indigo-400" : "bg-slate-200 mt-8"
              )}
            >
              <div className="border-b px-2 py-8">
                <p className="text-2xl font-bold">{opt.name}</p>
                <p className="my-2 text-6xl">${opt.price}</p>
                <p>Lorem ipsum dolor sit amet.</p>
              </div>

              <div className="border-b px-2 py-8">
                {activeplan === opt.price ? (
                  <Button
                    classnames="w-full"
                    //Manage the active plan
                  >
                    Active Plan
                  </Button>
                ) : (
                  <Button
                    classnames="w-full"
                    onClick={() => {
                      if (
                        user.username !== "Guest" &&
                        activeplan !== opt.price
                      ) {
                        // Upgrade plan
                        handleUpdateSubscription(opt.price);
                        console.log("Upgrade plan");
                      } else if (user.username !== "Guest" && !activeplan) {
                        handleSubscription(opt.price);
                      } else {
                        // Navigate to login
                      }
                    }}
                  >
                    {/* {!isLoading ? opt.cta : "isLoading..."} */}
                    {user.username !== "Guest" && activeplan !== opt.price
                      ? "Upgrade plan"
                      : user.username !== "Guest" && !activeplan
                      ? opt.cta
                      : opt.cta}
                  </Button>
                )}
              </div>

              <div className="px-2 py-4">
                <p className="font-bold">What's included :</p>

                <ul className="mt-4 flex flex-col gap-2">
                  {opt.perks.map((perk, index) => (
                    <li key={index} className="py-1">
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="">
          <Outlet />
        </div>
      </section>
    </>
  );
};

export default Pricing;
