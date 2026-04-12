import { useStripe} from "@stripe/react-stripe-js";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const CompleteCheckout = () => {
    const stripe = useStripe();
    const Navigate = useNavigate();
    const [status, setStatus] = useState("default");
    const [intentId, setIntentId] = useState<string | null>(null);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
            if (!paymentIntent) {
                return;
            }

            setStatus(paymentIntent.status);
            setIntentId(paymentIntent.id);
        });
    }, [stripe]);

    if (intentId && status === "succeeded") Navigate("/links");
    if (intentId && status === "processing") {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary">

                    </div>
                    <p className="text-xl font-medium">Processing your payment...</p>
                </div>
            </div>
        )
    };

    if (intentId && status === "requires_payment_method") {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary">

                    </div>
                    <p className="text-xl font-medium">Please provide your payment details</p>
                </div>
            </div>
        )
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary">
                    dd
                </div>
            </div>
        </div>
    )
};

export default CompleteCheckout;