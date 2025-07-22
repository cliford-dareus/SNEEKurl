import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db/connect";
import bodyParser from "body-parser";
import passport from "passport";
import jwt from "jsonwebtoken";
import csrf from "csurf";
dotenv.config();
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./config/uploadThing";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import shortRouter from "./routes/short";
import pageRouter from "./routes/page";
import stripeRouter from "./routes/stripe";
import onbordingRouter from "./routes/onbording";
import analyticsRouter from "./routes/analytics";
import notfoundMiddleware from "./middlewares/NotFound";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import { webhook } from "./config/webhook";
import cron_job from "./config/cron";
import { generalRateLimiter } from "./middlewares/rate-limiter";

const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  autoRemove: "native",
});

// Catch errors
store.on("error", function (error: any) {
  console.log(error);
});

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',') || ["http://localhost:5173"],
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
  })
);

// Apply general rate limiter early
app.use(generalRateLimiter);

app.use(
  session({
    name: "session.sid",
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.ENVIRONMENT === "production", // HTTPS only in production
      sameSite: "strict", // CSRF protection
    },
    store: store,
  })
);

app.use(passport.initialize());
require("./config/strategy");

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.ENVIRONMENT === "production",
    sameSite: "strict"
  }
});

// Routes
app.use("/auth", csrfProtection, authRouter);
app.use("/user", csrfProtection, userRouter);
app.use("/short", shortRouter);
app.use("/page", csrfProtection, pageRouter);
app.use("/stripe", csrfProtection, stripeRouter);
app.use("/sneekurl/fp", onbordingRouter);
app.use("/short/analytics", analyticsRouter);

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
  })
);

webhook(app, bodyParser);

app.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use(notfoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await cron_job();
    connectDB(process.env.MONGO_URI!);
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
