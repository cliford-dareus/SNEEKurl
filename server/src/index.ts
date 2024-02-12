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
import stripe from "./config/stripe";
dotenv.config();

import authRouter from "./routes/auth";
import shortRouter from "./routes/short";
import stripeRouter from "./routes/stripe";

import notfoundMiddleware from "./middlewares/NotFound";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import User from "./models/user";
import { webhook } from "./config/webhook";

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
    // rolling: true,
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
app.use("/short", shortRouter);
app.use("/stripe", stripeRouter);

app.post("/sneekurl/fp", async (req: any, res) => {
  const { client_id } = req.query;
  req.session.client_id = client_id
  req.session.isAuthenticated = false;

  try {
    const not_found_user = await User.findOne({
      clientId: req.session.client_id,
    });

    if (not_found_user) {
      return res.status(201).send();
    }

    const user = {
      username: "user",
      email: "user@example.com",
      password: req.session.client_id,
      clientId: req.session.client_id,
    };

    User.create(user);
    res.status(200).send();
  } catch (error) {
    res.status(401).send();
  }
});

webhook(app, bodyParser);

//custom middleware
// app.use(notfoundMiddleware);
// app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI!);
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
