import { StatusCodes } from 'http-status-codes';
import CustomError from './CustomError';

class BadRequest extends CustomError {
    statusCode : unknown
    constructor(message:string){
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
};

export default BadRequest;