import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51MiOgZKUFU6FXAtFupYpHGTemphVsscjKMmIHn38u9OVBdvdgLwSZufnm3KUXocUwchbwlUrHYJOay2phaMoKOxS00aM4Em5dC",
  { apiVersion: "2023-10-16" }
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <Provider store={store}>
        <App />
      </Provider>
    </Elements>
  </React.StrictMode>
);
