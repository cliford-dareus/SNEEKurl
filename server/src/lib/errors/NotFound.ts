import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError";

class NotFound extends CustomError {
  constructor(message = "Resource not found", code = "NOT_FOUND") {
    super(message, StatusCodes.NOT_FOUND, code);
  }
}

export default NotFound;
