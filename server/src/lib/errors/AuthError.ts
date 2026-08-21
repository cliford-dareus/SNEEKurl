import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError";

class Unauthenticated extends CustomError {
  constructor(message = "Authentication required", code = "UNAUTHORIZED") {
    super(message, StatusCodes.UNAUTHORIZED, code);
  }
}

export default Unauthenticated;
