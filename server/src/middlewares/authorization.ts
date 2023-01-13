import { NextFunction, Request, Response } from "express";
import { BadRequest, Unauthenticated } from "../errors";
import jwt from 'jsonwebtoken';


const authorize = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { accessToken, accessToken_not_login } = req.signedCookies; 

    try {
        if(accessToken){
            const payload = jwt.verify(accessToken, process.env.JWT_SECRET!);
            
            req.user = payload;
            next();
        }

        else{
            const payload = jwt.verify(accessToken_not_login, process.env.JWT_SECRET!);
            req.user = payload;
            next();
        };
    } catch (error) {
        console.log(error);    
    }
};

export default authorize;