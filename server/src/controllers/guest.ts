import jwt from "jsonwebtoken";
import User from "../models/user";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";


export const onbording = async (req: any, res: Response) => {
    const {client_id} = req.query;
    const auth_sid = req.signedCookies["auth.sid"];

    req.session.client_id = client_id;
    req.session.isAuthenticated = false;

    try {
        if (!auth_sid) {
            const guest_sid = jwt.sign(
                {user_name: "Guest", client_id: client_id},
                process.env.JWT_SECRET!,
                {expiresIn: "1d"}
            );

            res.cookie("guest.sid", guest_sid, {
                httpOnly: true,
                signed: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                message: "login as Guest",
                token: client_id,
            });
        }

        // Check if auth_sid is valid and user is verified
        const decoded_payload = jwt.verify(
            auth_sid,
            process.env.JWT_SECRET!
        ) as jwt.JwtPayload;

        const user = await User.findOne({
            _id: decoded_payload["user_id"],
        });

        if (!user) {
            return res.status(401).json({message: "User not found"});
        }

        // Check if user is verified
        req.session.isAuthenticated = true;
        // req.session.client_id = user._id

        const payload = jwt.sign(
            {user_id: user._id, user_name: user.username},
            process.env.JWT_SECRET!,
            {expiresIn: "1d"}
        );

        res.cookie("auth.sid", payload, {
            httpOnly: true,
            signed: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Update user with new client_id in db
        res.status(200).send({
            message: "Login successful",
            user: {
                username: user.username,
                stripe_account_id: user.stripe_account_id,
                isVerified: true,
            },
            // Doesn't need to send Payload to frontend
            token: payload,
        });
    } catch (e) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: "Smothing went wrong!"});
    }
}
