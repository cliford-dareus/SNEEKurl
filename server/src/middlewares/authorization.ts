import { NextFunction, Request, Response } from "express";
import { Unauthenticated } from "../errors";
import jwt from 'jsonwebtoken';

const authorize =async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.signedCookies;
    
    try {
        const isValidToken = jwt.verify(accessToken, process.env.JWT_SECRET!);
        
        if(!isValidToken){
            throw new Unauthenticated('Authentication Failed');
        }

        next()
    } catch (error) {
        console.log(error);
    }
};

export default authorize;