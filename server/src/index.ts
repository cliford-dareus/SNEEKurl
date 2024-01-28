import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db/connect";
dotenv.config();

// import authRouter from "./routes/auth";
// import shortRouter from "./routes/short";

import notfoundMiddleware from "./middlewares/NotFound";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import passport from "passport";

const app = express();

app.use(morgan("combined"));
app.use(cors({ origin: '*', credentials: true }));
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));


app.use(
  session({
    name: "sid",
    secret: "sneek-url",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: "auto",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: process.env.ENVIRONMENT === "production" ? "none" : false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./config/strategy');

// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/short", shortRouter);


app.get("/account", ensureAuthenticated, function (req, res) {
  res.send(`<h1>account</h1> <br/> <p>${req.user}</p>`);
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "http://localhost:5173/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:5173");
  }
);

app.get("/logout", function (req, res) {
  req.logout(() => console.log("logged out"));
  res.redirect("http://localhost:5173");
});

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

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("http://localhost:5173/login");
}

start();
