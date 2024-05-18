import { FormEvent, useState } from "react";
import { Sheet, SheetContent } from "./ui/sheet";
import { useLocation, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "./ui/button";
import { PaymentIntent, StripeCardElement } from "@stripe/stripe-js";
import { useAppSelector } from "../app/hook";

type Props = {};

const Checkout = (props: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const Navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null
  );
  const [message, setMessage] = useState<string>("");
  const {
    state: { subscriptionId, client_secret },
  } = useLocation();

  if (!stripe || !elements) {
    return null;
  }

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const cardElement = elements.getElement(CardElement) as StripeCardElement;

    let { error, paymentIntent } = await stripe.confirmCardPayment(
      client_secret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.username,
          },
        },
      }
    );

    if (error) {
      setMessage(error.message!);
      return;
    }
    setPaymentIntent(paymentIntent!);
  };

  if (paymentIntent && paymentIntent.status === "succeeded") {
    Navigate("/");
  }

  return (
    <>
      <Sheet />
      <SheetContent classnames="fixed top-0 right-0 bottom-0 w-[30%] bg-red-400 py-10 text-left px-8">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis.</p>

        <form className="mt-8" onSubmit={handleCheckout}>
          <div className="relative rounded-xl bg-blue-800 p-4 h-[200px] w-[70%]">
            <div className="absolute top-4 left-4 font-bold">Visa</div>
            <div className="absolute right-4 bottom-4 left-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      iconColor: "#ffffff",
                      color: "white",
                      ":-webkit-autofill": {
                        color: "#dad8d1",
                      },
                      "::placeholder": {
                        color: "#ffffff",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <Button classnames="mt-8">Proceed</Button>
        </form>
      </SheetContent>
    </>
  );
};

export default Checkout;
