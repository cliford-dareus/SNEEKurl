import { useEffect, useState } from "react";
import Button from "../components/ui/button";
import classNames from "classnames";
import { useAppSelector } from "../app/hook";
import { Outlet, useNavigate } from "react-router-dom";
import {
  useCreateSubscriptionMutation,
  useRetrieveSubscriptionQuery,
} from "../app/services/stripe";
import {SubcriptionOptions} from "../Utils/common";

type Props = {};

const Pricing = (props: Props) => {
  const { data, refetch } = useRetrieveSubscriptionQuery();
  const Navigate = useNavigate();
  const [create_subscription, { isLoading }] = useCreateSubscriptionMutation();
  const [activeplan, setActivePlan] = useState<any | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const [subscriptionData, setSubscriptionData] = useState<{
    subscriptionId: string;
    client_secret: string;
  } | null>(null);

  const handleSubscription = async (price: any) => {
    const payload = { plan_price: price, username: user.username };
    try {
      const subscription = await create_subscription(payload).unwrap();
      const { subscriptionId, client_secret } = subscription;
      setSubscriptionData({ subscriptionId, client_secret });
    } catch (error) {
      console.log(error);
    }
  };

  if (subscriptionData) {
    Navigate("checkout", { state: subscriptionData });
  }

  useEffect(() => {
    if (!data) return;

    const active_plan = data?.subscription?.data.filter(
      (x: any) => x.status === "active"
    )[0];

    if (!active_plan) {
      refetch();
    }
    setActivePlan(active_plan);
  }, [data]);

  return (
    <>
      <section className="text-black dark:text-white container mx-auto p-4 flex justify-center text-center flex-col relative">
        <div className="mt-16">
          <h1 className="text-black dark:text-white text-7xl mt-5 max-w-[700px] mx-auto">
            Prices small, connect big!
          </h1>
          <p className="mt-4">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam,
            quos?
          </p>
        </div>

        <div className="flex max-w-[1000px] mx-auto gap-4 w-full mt-16 text-left">
          {SubcriptionOptions.map((opt) => (
            <div
              key={opt.id}
              className={classNames(
                "flex-1 p-4 rounded-lg shadow-lg",
                opt.popular ? "bg-red-400" : "bg-slate-300 mt-8"
              )}
            >
              <div className="border-b px-2 py-8">
                <p className="text-2xl font-bold">{opt.name}</p>
                <p className="text-6xl my-2">${opt.price}</p>
                <p>Lorem ipsum dolor sit amet.</p>
              </div>

              <div className="py-8 px-2 border-b">
                {activeplan?.plan?.amount / 100 === opt.price ? (
                  <Button
                    classnames="w-full"
                    //Manage the active plan
                  >
                    Active Plan
                  </Button>
                ) : (
                  <Button
                    classnames="w-full"
                    onClick={() => handleSubscription(opt.price)}
                  >
                    {!isLoading ? opt.cta : "isLoading..."}
                  </Button>
                )}
              </div>

              <div className="py-4 px-2">
                <p className="font-bold">What's included :</p>

                <ul className="flex flex-col gap-2 mt-4">
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
