import { Request, Response } from "express";
import { notFound } from "../lib/api/response";

const notFoundMiddleware = (req: Request, res: Response) =>
  notFound(res, `Route ${req.method} ${req.originalUrl} not found`);

export default notFoundMiddleware;
