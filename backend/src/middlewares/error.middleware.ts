import { Request, Response, NextFunction } from "express";

/**
 * Global error handling middleware.
 * Catches all unhandled errors, logs them internally, and returns a standard JSON response.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error details internally for debugging
  console.error("Unhandled Error caught by middleware:", err);

  const status = err.status || 500;
  
  // Prevent leaking internal details or stack traces on 500 errors
  const message = status === 500 ? "Internal server error" : err.message || "Something went wrong";

  return res.status(status).json({
    error: {
      message,
      status,
    },
  });
};
