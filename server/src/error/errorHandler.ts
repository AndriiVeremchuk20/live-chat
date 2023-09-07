import { Request, Response, NextFunction } from "express";
import logger from "../logger";
import HttpError from "./HttpError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof HttpError ? err.code : 500;
  logger.error(err.message);
  return res
    .status(statusCode)
    .send({ status: "error", message: err.message || "Server error" });
};
