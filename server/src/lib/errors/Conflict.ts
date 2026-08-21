import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError";

class Conflict extends CustomError {
  constructor(message = "Resource already exists", code = "CONFLICT") {
    super(message, StatusCodes.CONFLICT, code);
  }
}

export default Conflict;
