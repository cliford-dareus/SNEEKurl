import passport from "passport";
import User from "../models/user";
import mongoose from "mongoose";
import JwtStrategy, { JwtFromRequestFunction } from "passport-jwt";
import { cookieExtractor } from "./jwt";
const Strategy = JwtStrategy.Strategy;

export interface PassportOptions {
  secretOrKey: string;
  jwtFromRequest: JwtFromRequestFunction;
}

const opts = {} as PassportOptions;
opts.secretOrKey = process.env.JWT_SECRET!;
opts.jwtFromRequest = cookieExtractor;

passport.use(
  new Strategy(opts, (user, done) => {
    console.log(user);
    User.findOne({ id: user.id })
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      })
      .catch((err) => {
        console.log(err);
        return done(err, false);
      });
  })
);

// Type for the serializeUser function
// const serializeUser = (user: any, done: DoneCallback) => {
//   done(null, user.id);
// };

// Use the serializeUser function with your Passport setup
// passport.serializeUser(serializeUser);

// passport.deserializeUser(function (user: any, done) {
//   const userd = User.findById(user?.id);
//   done(null, userd);
// });
