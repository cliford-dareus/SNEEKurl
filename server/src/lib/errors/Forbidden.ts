import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError";

class Forbidden extends CustomError {
  constructor(message = "Access denied", code = "FORBIDDEN") {
    super(message, StatusCodes.FORBIDDEN, code);
  }
}

export default Forbidden;
