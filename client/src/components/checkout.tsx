import { FormEvent, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { useLocation, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "./ui/button";
import { PaymentIntent, StripeCardElement } from "@stripe/stripe-js";
import { useAppSelector } from "../app/hook";
import { toast } from "react-toastify";
import { DialogDescription } from "./ui/dialog";

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
      toast.error(error.message!);
      return;
    }
    setPaymentIntent(paymentIntent!);
  };

  if (paymentIntent && paymentIntent.status === "succeeded") {
    Navigate("/");
  }

  return (
    <>
      <Sheet>
      <SheetContent
        side="right"
        size="lg"
        className="bg-base-100"
        closeOnOutsideClick={true}
        closeOnEscape={true}
      >
        <SheetHeader>
              <div className="flex items-center gap-3">
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 200 250"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                              fill="currentColor"
                            />
                          </svg>
                          <div>
                            <SheetTitle>Checkout</SheetTitle>
                            <DialogDescription>Enter the card details to checkout</DialogDescription>
                          </div>
                        </div>
        </SheetHeader>

        <div className="px-6 py-4">
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

          <Button classnames="mt-8 bg-primary">Proceed</Button>
        </form>
        </div>


      </SheetContent>
      </Sheet>
    </>
  );
};

export default Checkout;
