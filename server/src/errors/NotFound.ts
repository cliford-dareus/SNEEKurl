import { StatusCodes } from 'http-status-codes';
import CustomError from './CustomError';

class NotFound extends CustomError {
    statusCode : unknown
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
};

export default NotFound;