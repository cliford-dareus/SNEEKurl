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
import 'react-toastify/dist/ReactToastify.css';
import { ThemeToastContainer } from "./components/ThemeToastContainer";
import { TooltipProvider } from "./components/ui/tooltip";

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
    { apiVersion: "2023-10-16" }
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider>
            {/*<Elements stripe={stripePromise} options={{ clientSecret: import.meta.env.VITE_STRIPE_CLIENT_SECRET || "" }}>*/}
            <Provider store={store}>
                <TooltipProvider>
                    <BrowserRouter>
                        <App />
                        <ThemeToastContainer />
                    </BrowserRouter>
                </TooltipProvider>
            </Provider>
            {/*</Elements>*/}
        </ThemeProvider>
    </React.StrictMode>
);
