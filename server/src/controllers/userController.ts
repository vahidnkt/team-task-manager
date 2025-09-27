import { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";
import { AuthRequest } from "../types/auth.types";
import { ApiResponse } from "../types/api.types";
import { HTTP_STATUS } from "../utils/constants";
import { AppError } from "../types/common.types";

export class UserController {
  // Create new user (admin only)
  async createUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = req.body;

      // Validate required fields
      if (!userData.email || !userData.password || !userData.username) {
        const error: AppError = new Error(
          "Email, username, and password are required"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        const error: AppError = new Error("Invalid email format") as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Validate password strength
      if (userData.password.length < 6) {
        const error: AppError = new Error(
          "Password must be at least 6 characters long"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Validate password complexity
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(userData.password)) {
        const error: AppError = new Error(
          "Password must contain at least one lowercase letter, one uppercase letter, and one number"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Validate username
      if (userData.username.length < 3) {
        const error: AppError = new Error(
          "Username must be at least 3 characters long"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Validate username format (letters, numbers, underscores only)
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(userData.username)) {
        const error: AppError = new Error(
          "Username can only contain letters, numbers, and underscores"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Validate role if provided
      if (userData.role && !["user", "admin"].includes(userData.role)) {
        const error: AppError = new Error(
          "Role must be either 'user' or 'admin'"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      const newUser = await userService.createUser(userData);

      const response: ApiResponse = {
        success: true,
        data: newUser,
        message: "User created successfully",
      };
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Get all users (admin only)
  async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        search,
        role,
        limit = "10",
        offset = "0",
        sortBy = "created_at",
        sortOrder = "DESC",
      } = req.query;

      // Validate and parse query parameters
      const parsedLimit = parseInt(limit as string, 10);
      const parsedOffset = parseInt(offset as string, 10);

      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Limit must be a number between 1 and 100",
        });
        return;
      }

      if (isNaN(parsedOffset) || parsedOffset < 0) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Offset must be a non-negative number",
        });
        return;
      }

      if (role && !["user", "admin"].includes(role as string)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Role must be either 'user' or 'admin'",
        });
        return;
      }

      if (
        sortBy &&
        ![
          "username",
          "email",
          "created_at",
          "updated_at",
          "createdAt",
          "updatedAt",
        ].includes(sortBy as string)
      ) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message:
            "sortBy must be one of: username, email, created_at, updated_at, createdAt, updatedAt",
        });
        return;
      }

      if (sortOrder && !["ASC", "DESC"].includes(sortOrder as string)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "sortOrder must be either 'ASC' or 'DESC'",
        });
        return;
      }

      const result = await userService.getAllUsers({
        search: search as string,
        role: role as string,
        limit: parsedLimit,
        offset: parsedOffset,
        sortBy: sortBy as
          | "username"
          | "email"
          | "created_at"
          | "updated_at"
          | "createdAt"
          | "updatedAt",
        sortOrder: sortOrder as "ASC" | "DESC",
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: "Users retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to retrieve users",
      });
    }
  }

  // Get specific user by ID
  async getUserById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        const error: AppError = new Error("User ID is required") as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      const user = await userService.getUserById(id);

      if (!user) {
        const error: AppError = new Error("User not found") as AppError;
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.isOperational = true;
        throw error;
      }

      const response: ApiResponse = {
        success: true,
        data: user,
        message: "User retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Update user
  async updateUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        const error: AppError = new Error("User ID is required") as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Check if user can update this profile
      if (req.user?.role !== "admin" && req.user?.userId !== id) {
        const error: AppError = new Error(
          "Not authorized to update this user"
        ) as AppError;
        error.statusCode = HTTP_STATUS.FORBIDDEN;
        error.isOperational = true;
        throw error;
      }

      const updatedUser = await userService.updateUser(id, updateData);

      const response: ApiResponse = {
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Delete user (admin only)
  async deleteUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        const error: AppError = new Error("User ID is required") as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Prevent admin from deleting themselves
      if (req.user?.userId === id) {
        const error: AppError = new Error(
          "Cannot delete your own account"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      await userService.deleteUser(id);

      const response: ApiResponse = {
        success: true,
        message: "User deleted successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  async getCurrentUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        const error: AppError = new Error("User not authenticated") as AppError;
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        error.isOperational = true;
        throw error;
      }

      const user = await userService.getUserById(req.user.userId);

      const response: ApiResponse = {
        success: true,
        data: user,
        message: "Current user retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
