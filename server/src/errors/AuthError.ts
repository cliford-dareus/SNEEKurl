import { StatusCodes } from 'http-status-codes';
import CustomError from './CustomError';

class Unauthenticated extends CustomError {
    statusCode : unknown
    constructor(message:string){
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
};

export default Unauthenticated;