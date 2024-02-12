import passport from "passport";
import User from "../models/user";
import JwtStrategy, { JwtFromRequestFunction } from "passport-jwt";
import { cookieExtractor } from "../lib/utils/jwt";
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
        return done(err, false);
      });
  })
);
