import { Request, Response, NextFunction } from "express";
import config from "../config/environment";
import { AppError } from "../types";

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let isOperational = false;

  // Handle known application errors
  if (error instanceof Error && "statusCode" in error) {
    statusCode = (error as AppError).statusCode;
    message = error.message;
    isOperational = (error as AppError).isOperational;
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Log error details
  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    statusCode,
    isOperational,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Don't leak error details in production
  if (config.server.env === "production" && !isOperational) {
    message = "Something went wrong";
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(config.server.env === "development" && {
      stack: error.stack,
      details: error,
    }),
  });
};

/**
 * Handle 404 Not Found
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error: AppError = new Error(
    `Route ${req.originalUrl} not found`
  ) as AppError;
  error.statusCode = 404;
  error.isOperational = true;
  next(error);
};

/**
 * Handle async errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validation Error Handler
 */
export const validationErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error.name === "ValidationError") {
    const validationError: AppError = new Error(
      "Validation failed"
    ) as AppError;
    validationError.statusCode = 400;
    validationError.isOperational = true;
    next(validationError);
  } else {
    next(error);
  }
};

/**
 * Database Error Handler
 */
export const databaseErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Database error occurred";

  // Handle specific MySQL errors
  switch (error.code) {
    case "ER_DUP_ENTRY":
      statusCode = 409;
      message = "Duplicate entry";
      break;
    case "ER_NO_REFERENCED_ROW_2":
      statusCode = 400;
      message = "Referenced record not found";
      break;
    case "ER_ROW_IS_REFERENCED_2":
      statusCode = 400;
      message = "Cannot delete referenced record";
      break;
    case "ER_ACCESS_DENIED_ERROR":
      statusCode = 500;
      message = "Database access denied";
      break;
    case "ECONNREFUSED":
      statusCode = 503;
      message = "Database connection failed";
      break;
    default:
      if (error.code && error.code.startsWith("ER_")) {
        statusCode = 400;
        message = "Database constraint violation";
      }
  }

  const dbError: AppError = new Error(message) as AppError;
  dbError.statusCode = statusCode;
  dbError.isOperational = true;
  next(dbError);
};
