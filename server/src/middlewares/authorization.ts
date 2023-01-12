import { NextFunction, Request, Response } from "express";
import { BadRequest, Unauthenticated } from "../errors";
import jwt from 'jsonwebtoken';

const authorize = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const  headers  = req.headers.authorization;

    if (!headers || !headers.startsWith('Bearer ')) {
        return next(new BadRequest('Not authorized'));
    };

    const token = headers?.split(' ')[1];

    try {
        const isValidToken = jwt.verify(token, process.env.JWT_SECRET!);

        if(!isValidToken){
            throw new Unauthenticated('Authentication Failed');
        };

        req.user = isValidToken;
        next();
        
    } catch (error) {
        console.log(error);
    }
};

export default authorize;