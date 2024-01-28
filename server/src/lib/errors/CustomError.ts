

class CustomError extends Error {
    public BadRequest: unknown
    constructor(message: string){
        super(message);
    };
};

export default CustomError;