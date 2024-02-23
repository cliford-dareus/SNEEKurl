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


app.use(
    "/api/uploadthing",
    createRouteHandler({
      router: uploadRouter,
      // config: { ... },
    }),
);
app.post("/sneekurl/fp", async (req: any, res) => {
  const { client_id } = req.query;
  const auth_sid = req.signedCookies["auth.sid"];
  req.session.client_id = client_id;
  req.session.isAuthenticated = false;

  try {
    const not_found_user = await User.findOne({
      clientId: req.session.client_id,
    });

    if (not_found_user && auth_sid) {
      const decoded_payload = jwt.verify(
        auth_sid,
        process.env.JWT_SECRET!
      ) as jwt.JwtPayload;

      const isVerified =
        decoded_payload["user_id"] === not_found_user._id.toString() &&
        decoded_payload["user_name"] === not_found_user.username.toString();

      if (isVerified) {
        req.session.isAuthenticated = true;

        const payload = jwt.sign(
          { user_id: not_found_user._id, user_name: not_found_user.username },
          process.env.JWT_SECRET!,
          { expiresIn: "1d" }
        );

        res.cookie("auth.sid", payload, {
          httpOnly: true,
          signed: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).send({
          message: "Login successful",
          user: {
            username: not_found_user.username,
            stripe_account_id: not_found_user.stripe_account_id,
            isVerified: true,
          },
          token: payload,
        });
      }
    } else if (not_found_user) {
      res.status(200).send({
        message: "login as Guest",
        user: {
          username: "Guest",
          isVerified: false,
        },
      });
    } else {
      const user = {
        username: "guest",
        email: "user@example.com",
        password: req.session.client_id,
        clientId: req.session.client_id,
      };

      await User.create(user);
      res.status(200).send({ message: "Guest created" });
    }
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
