
class CustomError extends Error {
    BadRequest
    constructor(message){
        super(message);
    };
};

export default CustomError;