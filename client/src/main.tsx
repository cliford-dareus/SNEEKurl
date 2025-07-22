import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Use environment variable for publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
  { apiVersion: "2023-10-16" }
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <Elements stripe={stripePromise}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
            <ToastContainer position="top-right" theme="dark" />
          </BrowserRouter>
        </Provider>
      </Elements>
    </ThemeProvider>
  </React.StrictMode>
);
