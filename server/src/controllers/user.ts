import {Response, Request} from "express";
import {StatusCodes} from "http-status-codes";
import User from "../models/user";
import bcrypt from "bcrypt";
import {SendVerifyPasswordEmail} from "../lib/utils/send-verify-password-email";
import jwt from "jsonwebtoken";

const updateProfileImage = async (req: Request, res: Response) => {
    const {file} = req.body;
    const user = req.user;

    // @ts-ignore
    const isUserInDb = await User.findOne({_id: user?._id});

    if (!isUserInDb)
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: 'User not found'});

    try {
        await isUserInDb.updateOne({_id: isUserInDb._id}, {$set: {profile: file}}).exec();
        res
            .status(StatusCodes.OK)
            .send({message: 'Profile image has been updated'})
    } catch (e) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: ''})
    }
};

const deleteProfileImage = async (req: Request, res: Response) => {};

const updateProfileDetails = async (req: Request, res: Response) => {
    const {username, email, oldpassword, newpassword} = req.body;
    const user = req.user;
    // @ts-ignore
    const isUserInDb = await User.findOne({_id: user?._id});

    if (!isUserInDb)
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: 'User not found'});

    if (!username && !email && !oldpassword && !newpassword)
        return res.status(StatusCodes.BAD_REQUEST)
            .send({message: 'User not found'});

    try {
        if (oldpassword && newpassword) {
            const tenMinutes = 1000 * 60 * 10;
            const salt = await bcrypt.genSalt(10);
            const passwordToken = crypto.randomUUID();
            const o = jwt.sign({oldpassword, newpassword}, process.env.JWT_SECRET!,
                {
                    expiresIn: tenMinutes,

                })
            const hashPasswordToken = await bcrypt.hash(passwordToken, salt);

            await SendVerifyPasswordEmail({
                email: isUserInDb.email,
                name: isUserInDb.username,
                token: passwordToken,
                domain: 'http://localhost:4080',
                o
            })

            const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

            isUserInDb.passwordToken = hashPasswordToken;
            isUserInDb.username = username;
            isUserInDb.passwordTokenLife = passwordTokenExpirationDate;
            isUserInDb.save();

            return res
                .status(StatusCodes.OK)
                .send({message: 'Check your email to confirm changes...'})
        }

        await User.findOneAndUpdate(
            {_id: isUserInDb._id},
            {
                $set: {
                    username,
                    email
                }
            }
        )

        return res
            .status(StatusCodes.OK)
            .send({message: 'Profile Successfully updated...'})

    } catch (e) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: ''})
    }
};

const resetPassword = async (req: Request, res: Response) => {
    const {email, token, o} = req.query;

    if (!token || !email || !o) {
        res.status(StatusCodes.BAD_REQUEST).send()
    }

    const isUserInDb = await User.findOne({email});

    const decoded_payload = jwt.verify(
        o as string,
        process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    const newpassword = decoded_payload['newpassword']

    try {
        if (isUserInDb) {
            const currentDate = new Date();
            const isTokenExpired = isUserInDb.passwordTokenLife! > currentDate;
            const isPasswordTokenCorrect = await bcrypt.compare(token as string, isUserInDb.passwordToken!);

            if (isTokenExpired && isPasswordTokenCorrect) {
                isUserInDb.password = newpassword;
                isUserInDb.passwordToken = '';
                isUserInDb.passwordTokenLife = null;
                await isUserInDb.save()
            }

            return res
                .status(StatusCodes.OK)
                .send({message: 'Password Successfully updated...'})
        }

    } catch (e) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: ''})
    }
};

const requestAccountDeletion = async (req: Request, res: Response) => {
    const user = req.user;
    
    try{

    }catch (error){
        console.log(error)
    }
};

const deleteAccount = async (req: Request, res: Response) => {
    const user = req.user;


};

export {updateProfileImage,deleteProfileImage, updateProfileDetails, deleteAccount, resetPassword}