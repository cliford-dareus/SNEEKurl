
class CustomError extends Error {
    BadRequest: any
    constructor(message: string){
        super(message);
    };
};

export default CustomError;