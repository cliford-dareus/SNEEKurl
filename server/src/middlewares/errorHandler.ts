import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError, ApiErrorDetail } from "../lib/api/response";
import CustomError from "../lib/errors/CustomError";

const errorHandlerMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (res.headersSent) {
    return;
  }

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong. Please try again later.";
  let code = "INTERNAL_ERROR";
  let errors: ApiErrorDetail[] | undefined;

  if (err instanceof CustomError || (err.statusCode && err.message)) {
    statusCode = err.statusCode || statusCode;
    message = err.message || message;
    code = err.code || code;
    errors = err.errors;
  }

  if (err.name === "ValidationError" && err.errors) {
    statusCode = StatusCodes.BAD_REQUEST;
    code = "VALIDATION_ERROR";
    errors = Object.entries(err.errors).map(([field, item]: [string, any]) => ({
      field,
      message: item.message || "Invalid value",
      code: item.kind || "invalid",
    }));
    message = errors.map((e) => e.message).join("; ") || "Validation failed";
  }

  if (err.code === 11000 && err.keyValue) {
    statusCode = StatusCodes.CONFLICT;
    code = "DUPLICATE_KEY";
    const fields = Object.keys(err.keyValue);
    message = `${fields.join(", ")} already in use. Please choose another value.`;
    errors = fields.map((field) => ({
      field,
      message: `Value "${err.keyValue[field]}" is already taken`,
      code: "duplicate",
    }));
  }

  if (err.name === "CastError") {
    statusCode = StatusCodes.BAD_REQUEST;
    code = "INVALID_ID";
    message = `Invalid ${err.path || "id"}: ${err.value}`;
    errors = [{ field: err.path, message, code: "cast_error" }];
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    code = "INVALID_TOKEN";
    message = "Invalid authentication token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    code = "TOKEN_EXPIRED";
    message = "Authentication token has expired. Please log in again.";
  }

  if (err.name === "ZodError" && Array.isArray(err.issues)) {
    statusCode = StatusCodes.BAD_REQUEST;
    code = "VALIDATION_ERROR";
    errors = err.issues.map((issue: any) => ({
      field: issue.path?.join(".") || undefined,
      message: issue.message,
      code: issue.code,
    }));
    message = errors[0]?.message || "Validation failed";
  }

  if (err.code === "EBADCSRFTOKEN") {
    statusCode = StatusCodes.FORBIDDEN;
    code = "INVALID_CSRF";
    message = "Invalid or missing CSRF token. Refresh the page and try again.";
  }

  if (
    statusCode >= 500 &&
    process.env.NODE_ENV === "production" &&
    !(err instanceof CustomError)
  ) {
    message = "Something went wrong. Please try again later.";
    code = "INTERNAL_ERROR";
    errors = undefined;
  } else if (statusCode >= 500 && process.env.NODE_ENV !== "production") {
    if (err?.message && message === "Something went wrong. Please try again later.") {
      message = err.message;
    }
  }

  if (statusCode >= 500) {
    console.error("[API Error]", err);
  }

  return sendError(res, statusCode, message, { code, errors });
};

export default errorHandlerMiddleware;
