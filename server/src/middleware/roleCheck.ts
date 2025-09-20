import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";

// Note: Basic role checking functions (requireAdmin, requireUser) are available in auth.ts
// This file contains project-specific and advanced role checking middleware

// Middleware to check if user can access resource (either admin or resource owner)
export const requireOwnershipOrAdmin = (userIdParam: string = "id") => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        const error = new Error("User not authenticated") as any;
        error.statusCode = 401;
        error.isOperational = true;
        throw error;
      }

      const resourceUserIdParam = req.params[userIdParam];
      if (!resourceUserIdParam) {
        const error = new Error("Resource ID parameter is required") as any;
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
      }

      const resourceUserId = parseInt(resourceUserIdParam);

      // Allow access if user is admin or owns the resource
      if (req.user.role === "admin" || req.user.userId === resourceUserId) {
        next();
        return;
      }

      const error = new Error("Not authorized to access this resource") as any;
      error.statusCode = 403;
      error.isOperational = true;
      throw error;
    } catch (error) {
      next(error);
    }
  };
};

// Middleware to check multiple roles
export const requireAnyRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        const error = new Error("User not authenticated") as any;
        error.statusCode = 401;
        error.isOperational = true;
        throw error;
      }

      if (!allowedRoles.includes(req.user.role)) {
        const error = new Error(
          `Access denied. Required roles: ${allowedRoles.join(", ")}`
        ) as any;
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

// Middleware for project access control
export const requireProjectAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      const error = new Error("User not authenticated") as any;
      error.statusCode = 401;
      error.isOperational = true;
      throw error;
    }

    // Admin has access to all projects
    if (req.user.role === "admin") {
      next();
      return;
    }

    // For regular users, you might want to check project membership
    // This would require additional database queries to check if user is a member
    // For now, we'll allow all authenticated users to access projects
    next();
  } catch (error) {
    next(error);
  }
};
