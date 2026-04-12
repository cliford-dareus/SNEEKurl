import {useCallback, useEffect, useState} from "react";
import {Button} from "../components/ui/button";
import classNames from "classnames";
import {useAppSelector} from "../app/hook";
import {Outlet, useNavigate} from "react-router-dom";
import {LuCheck} from "react-icons/lu";
import {motion} from "framer-motion";
import {
    useCreateSubscriptionMutation,
    useRetrieveSubscriptionQuery,
    useUpdateSubscriptionMutation,
} from "../app/services/stripe";
import {pricingPlans} from "../Utils/common";
import {toast} from "react-toastify";
import {RootState} from "../app/store";

type Props = {};

const Pricing = (): JSX.Element => {
    const {user} = useAppSelector((state: RootState) => state.auth);
    const {data, refetch} = useRetrieveSubscriptionQuery(
        {username: user.username},
        {skip: !user.username}
    );
    const Navigate = useNavigate();
    const [create_subscription, {isLoading}] = useCreateSubscriptionMutation();
    const [update_subscription, {isLoading: updateLoading}] =
        useUpdateSubscriptionMutation();
    const [activeplan, setActivePlan] = useState<number | null>(null);
    const [subscriptionData, setSubscriptionData] = useState<{
        subscriptionId: string;
        client_secret: string;
    } | null>(null);

    const handleSubscription = useCallback(
        async (price: number): Promise<void> => {
            const payload = {plan_price: price, username: user.username};
            try {
                const subscription = await create_subscription(payload).unwrap();
                const {subscriptionId, client_secret} = subscription;
                setSubscriptionData({subscriptionId, client_secret});
            } catch (error) {
                console.log(error);
            }
        },
        [create_subscription, user.username]
    );

    const handleUpdateSubscription = useCallback(
        async (price: number): Promise<void> => {
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
            Navigate("/checkout", {state: subscriptionData});
        }
    }, [subscriptionData, Navigate]);

    useEffect(() => {
        if (!data?.subscription?.data?.length) {
            setActivePlan(0);
            return;
        }

        const activePlan = data.subscription.data.find(
            (x: any) => x.status === "active"
        );
        setActivePlan(activePlan?.items.data[0]?.plan?.amount / 100 || null);
    }, []);

    return (
        <div className="flex-1 h-screen bg-background/90">
            <section
                className="max-w-6xl flex-1 h-full relative mx-auto flex flex-col justify-center p-4">
                <div className="mt-16 text-center">
                    <h1 className="mx-auto mt-5 text-7xl text-neutral max-w-[700px] dark:text-neutral-content">
                        Prices small, connect big!
                    </h1>
                    <p className="mt-4">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam,
                        quos?
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
                    {pricingPlans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{opacity: 0, y: 30}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.6, delay: index * 0.1}}
                            viewport={{once: true}}
                            className={classNames(
                                "relative rounded-xl p-8 border-2",
                                plan.popular
                                    ? "border-primary bg-primary/5 scale-105"
                                    : "border-base-300 bg-base-100"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                                          Most Popular
                                        </span>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-base-content/70 mb-4">{plan.description}</p>
                                <div className="text-5xl font-bold mb-2">
                                    ${plan.price}
                                    <span className="text-lg font-normal text-base-content/70">/month</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <LuCheck className="text-success" size={16}/>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => handleSubscription(plan.price)}
                                className={classNames(
                                    "w-full",
                                    plan.popular
                                        ? "bg-primary text-white"
                                        : "bg-base-300 text-base-content"
                                )}
                            >
                                {activeplan == plan.price ? "Current Plan" : plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>

                <div className="">
                    <Outlet/>
                </div>
            </section>
        </div>
    );
};

export default Pricing;
