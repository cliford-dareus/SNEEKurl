/**
 * Base application error. Throw these from controllers/services;
 * errorHandlerMiddleware turns them into the standard API envelope.
 */
class CustomError extends Error {
  statusCode: number;
  code: string;
  errors?: Array<{ field?: string; message: string; code?: string }>;
  details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_ERROR",
    errors?: Array<{ field?: string; message: string; code?: string }>,
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default CustomError;
