import React, {FormEvent, useEffect, useState} from "react";
import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {LuArrowLeft, LuChevronLeft,} from "react-icons/lu";

const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    // const {user} = useAppSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit =async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);

        const {error} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout-status`,
            },
        });

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen pt-24">
            <div className="max-w-6xl mx-auto flex gap-4 flex-1">
                <div className="flex-1 p-4 border border-red-300">
                    <div className="flex items-center gap-2 cursor-pointer mb-4">
                        <LuChevronLeft className="h-6 w-6 text-primary"/>
                        <span>Back</span>
                    </div>

                    <h1 className="text-2xl font-bold mb-4">Checkout</h1>

                    <div className="">
                        <form className="mt-8" onSubmit={handleSubmit}>
                            <PaymentElement />
                            <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex-1">

                </div>
            </div>
        </div>
    )
}

export default CheckoutForm;