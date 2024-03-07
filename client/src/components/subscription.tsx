import Separator from "./ui/separator";
import {LuCheckCircle} from "react-icons/lu";
import Button from "./ui/button";
import {SubcriptionOptions} from "../Utils/common";
import {useRetrieveSubscriptionQuery} from "../app/services/stripe";
import {useUserPlan} from "./admin-layout";

type Props = {}
const Subscription = ({}: Props) => {
    const {data} = useRetrieveSubscriptionQuery();
    const plan = data?.subscription?.data[0].plan.metadata.name;

    return (
        <section className="rounded-md border">
            <div className="p-4">
                <h1 className="text-2xl font-medium">Subscription</h1>
                <Separator/>
                <div className="grid grid-cols-3 gap-4">
                    {SubcriptionOptions.map((options) =>
                        <div key={options.id}
                             className="flex flex-col gap-4 rounded-md bg-slate-100 p-4 shadow shadow-slate-200">
                            <h2 className="text-2xl font-medium">{options.name}</h2>
                            <p className="flex gap-1 text-4xl font-medium">${options.price}
                                <span className="text-xl font-normal">/months</span>
                            </p>
                            <Separator/>
                            <ul className="mb-auto">
                                {options.perks.map((perk, index) => (
                                    <li className="flex items-center gap-4">
                                        <LuCheckCircle className="h-4 w-4 text-slate-700"/>
                                        <p className="text-slate-700">{perk}</p>
                                    </li>
                                ))}
                            </ul>

                            {plan === options.name.toLowerCase() ?
                                <Button className="mt-4">Current Plan</Button> :
                                <Button className="mt-4 bg-red-500 ring-2 ring-indigo-500">Update Plan</Button>}
                        </div>)}
                </div>
            </div>

        </section>
    )
};

export default Subscription;