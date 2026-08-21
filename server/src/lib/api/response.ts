import { Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Standard API envelope used by every JSON response.
 *
 * Success: { success: true,  message, data?, meta? }
 * Error:   { success: false, message, code?, errors?, data? }
 */
export interface ApiSuccessBody<T = unknown> {
  success: true;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  /** Machine-readable error code for clients */
  code?: string;
  errors?: ApiErrorDetail[];
  data?: unknown;
}

export type ApiBody<T = unknown> = ApiSuccessBody<T> | ApiErrorBody;

export function sendSuccess<T>(
  res: Response,
  status: number,
  message: string,
  data?: T,
  meta?: Record<string, unknown>
) {
  const body: ApiSuccessBody<T> = { success: true, message };
  if (data !== undefined) body.data = data;
  if (meta !== undefined) body.meta = meta;
  return res.status(status).json(body);
}

export function sendError(
  res: Response,
  status: number,
  message: string,
  options?: {
    code?: string;
    errors?: ApiErrorDetail[];
    data?: unknown;
  }
) {
  const body: ApiErrorBody = {
    success: false,
    message,
  };
  if (options?.code) body.code = options.code;
  if (options?.errors?.length) body.errors = options.errors;
  if (options?.data !== undefined) body.data = options.data;
  return res.status(status).json(body);
}

/** Convenience wrappers */
export const ok = <T>(res: Response, message: string, data?: T, meta?: Record<string, unknown>) =>
  sendSuccess(res, StatusCodes.OK, message, data, meta);

export const created = <T>(res: Response, message: string, data?: T, meta?: Record<string, unknown>) =>
  sendSuccess(res, StatusCodes.CREATED, message, data, meta);

export const badRequest = (res: Response, message: string, errors?: ApiErrorDetail[], code = "BAD_REQUEST") =>
  sendError(res, StatusCodes.BAD_REQUEST, message, { code, errors });

export const unauthorized = (res: Response, message = "Authentication required", code = "UNAUTHORIZED") =>
  sendError(res, StatusCodes.UNAUTHORIZED, message, { code });

export const forbidden = (res: Response, message = "Access denied", code = "FORBIDDEN") =>
  sendError(res, StatusCodes.FORBIDDEN, message, { code });

export const notFound = (res: Response, message = "Resource not found", code = "NOT_FOUND") =>
  sendError(res, StatusCodes.NOT_FOUND, message, { code });

export const conflict = (res: Response, message: string, code = "CONFLICT") =>
  sendError(res, StatusCodes.CONFLICT, message, { code });

export const tooManyRequests = (res: Response, message = "Too many requests. Please try again later.", code = "RATE_LIMITED") =>
  sendError(res, StatusCodes.TOO_MANY_REQUESTS, message, { code });

export const paymentRequired = (res: Response, message: string, data?: unknown, code = "UPGRADE_REQUIRED") =>
  sendError(res, StatusCodes.PAYMENT_REQUIRED, message, { code, data });

export const internalError = (res: Response, message = "Something went wrong. Please try again later.") =>
  sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, message, { code: "INTERNAL_ERROR" });
