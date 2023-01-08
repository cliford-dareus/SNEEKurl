import { Errback, ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Default
    let customError = {
        statusCode : err.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || `Something went wrong try again later`
    };

    if(err.name === 'ValidationError'){
        customError.statusCode = 400;
        customError.msg = Object.values(err.errors)
            .map((item: any) => item.message)
            .join(',');
    };

    if (err.code && err.code === 11000) {
        customError.statusCode = 400;
        customError.msg = `Duplicate value entered for ${Object.keys(
        err.keyValue)} field, please choose another value`;
    };
    
    if (err.name === 'CastError') {
        customError.statusCode = 404;
        customError.msg = `No item found with id : ${err.value}`;
    };

    return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;