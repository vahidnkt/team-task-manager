import { Request, Response, NextFunction } from "express";
import jwtService from "../config/jwt";
import { JWTPayload } from ".././types/auth.types";
import { AppError } from ".././types/common.types";
// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * JWT Authentication Middleware
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      const error: AppError = new Error("Access token required") as AppError;
      error.statusCode = 401;
      error.isOperational = true;
      throw error;
    }

    // Verify token
    const decoded = jwtService.verifyToken(token);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    const authError: AppError = new Error(
      error instanceof Error ? error.message : "Authentication failed"
    ) as AppError;
    authError.statusCode = 401;
    authError.isOperational = true;
    next(authError);
  }
};

/**
 * Optional Authentication Middleware (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwtService.verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Don't throw error for optional auth, just continue without user
    next();
  }
};

/**
 * Role-based Authorization Middleware
 */
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        const error: AppError = new Error(
          "Authentication required"
        ) as AppError;
        error.statusCode = 401;
        error.isOperational = true;
        throw error;
      }

      if (!roles.includes(req.user.role)) {
        const requiredRoles = roles.join(" or ");
        const error: AppError = new Error(
          `Access denied. You need ${requiredRoles} role to access this resource. Your current role: ${req.user.role}`
        ) as AppError;
        error.statusCode = 403;
        error.isOperational = true;
        throw error;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Admin Only Middleware
 */
export const requireAdmin = requireRole(["admin"]);

/**
 * User or Admin Middleware
 */
export const requireUser = requireRole(["user", "admin"]);

/**
 * Check if user is the owner of a resource
 */
export const requireOwnership = (userIdField: string = "userId") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        const error: AppError = new Error(
          "Authentication required"
        ) as AppError;
        error.statusCode = 401;
        error.isOperational = true;
        throw error;
      }

      // Admin can access everything
      if (req.user.role === "admin") {
        return next();
      }

      // Check if user is accessing their own resource
      const resourceUserId = req.params[userIdField] || req.body[userIdField];

      if (!resourceUserId) {
        const error: AppError = new Error("Resource ID required") as AppError;
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
      }

      if (resourceUserId !== req.user.userId) {
        const error: AppError = new Error(
          "Access denied: Not your resource"
        ) as AppError;
        error.statusCode = 403;
        error.isOperational = true;
        throw error;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Extract user ID from token for logging/debugging
 */
export const getCurrentUserId = (req: Request): string | null => {
  return req.user?.userId || null;
};

/**
 * Check if current user is admin
 */
export const isAdmin = (req: Request): boolean => {
  return req.user?.role === "admin";
};
