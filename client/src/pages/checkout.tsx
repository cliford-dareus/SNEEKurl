import { useState} from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

import CheckoutForm from "../components/checkout-form";
import CompleteCheckout from "../components/complete-checkout";

type Props = {};

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
    {apiVersion: "2023-10-16"}
);

const Checkout = (props: Props) => {
    const {state: {client_secret}} = useLocation();
    return (
        <>
            {client_secret && <Elements stripe={stripePromise} options={{clientSecret: client_secret}}>
                <Routes>
                    <Route index element={<CheckoutForm />} />
                    <Route path="/checkout/success" element={<CompleteCheckout />}/>
                </Routes>
            </Elements>}
        </>
    );
};

export default Checkout;
