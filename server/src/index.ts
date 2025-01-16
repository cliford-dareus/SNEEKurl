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
dotenv.config();
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./config/uploadThing";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import shortRouter from "./routes/short";
import pageRouter from "./routes/page";
import stripeRouter from "./routes/stripe";
import onbordingRouter from "./routes/onbording";
import notfoundMiddleware from "./middlewares/NotFound";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import { webhook } from "./config/webhook";
import cron_job from "./config/cron";
import rateLimiter from "./middlewares/rate-limiter";

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
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
  })
);

app.use(
  session({
    name: "session.sid",
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: "auto",
      sameSite: "lax",
    },
    store: store,
  })
);

app.use(passport.initialize());
require("./config/strategy");

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/short", shortRouter);
app.use("/page", pageRouter);
app.use("/stripe", stripeRouter);
app.use("/sneekurl/fp", onbordingRouter);

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    // config: { ... },
  })
);

webhook(app, bodyParser);

//custom middleware
app.use(notfoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(rateLimiter);

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
