/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default values
  let statusCode = 500;
  let message = err.message || "Something went wrong";

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
  }

  res.status(statusCode).json({
    message,
    success: false,
    error: {
      name: err.name || "Error",
      errors: err.errors || null,
    },
  });
};
