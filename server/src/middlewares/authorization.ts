import {NextFunction, Request, Response} from "express";
import passport from "passport";
import User from "../models/user";
import {StatusCodes} from "http-status-codes";

const authorize = async (req: any, res: Response, next: NextFunction) => {
    passport.authenticate(
        "jwt",
        {session: true},
        async (err: any, result: any) => {
            if (err) {
                console.log(err);
            }
            // const clientId = req.session.client_id;
            // const user = await User.findOne({clientId});
            if (!result) {
                res.status(StatusCodes.FORBIDDEN).send()
            } else {
                req.user = result;
                next();
            }
        }
    )(req, res, next);
};

export default authorize;
