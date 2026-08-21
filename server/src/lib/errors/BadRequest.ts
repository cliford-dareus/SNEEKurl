import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError";

class BadRequest extends CustomError {
  constructor(
    message = "Invalid request",
    errors?: Array<{ field?: string; message: string; code?: string }>,
    code = "BAD_REQUEST"
  ) {
    super(message, StatusCodes.BAD_REQUEST, code, errors);
  }
}

export default BadRequest;
