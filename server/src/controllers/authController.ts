import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import { CreateUserRequest, LoginRequest, AuthResponse } from "../types";
import { ApiResponse } from "../types";
import { HTTP_STATUS } from "../utils/constants";
import { AppError } from "@/types/common.types";

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData: CreateUserRequest = req.body;

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

      // Validate username
      if (userData.username.length < 3) {
        const error: AppError = new Error(
          "Username must be at least 3 characters long"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Register user
      const result: AuthResponse = await authService.register(userData);

      const response: ApiResponse<AuthResponse> = {
        success: true,
        message: "User registered successfully",
        data: result,
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   * POST /api/auth/login
   */
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const loginData: LoginRequest = req.body;

      // Validate required fields
      if (!loginData.email || !loginData.password) {
        const error: AppError = new Error(
          "Email and password are required"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginData.email)) {
        const error: AppError = new Error("Invalid email format") as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Login user
      const result: AuthResponse = await authService.login(loginData);

      const response: ApiResponse<AuthResponse> = {
        success: true,
        message: "Login successful",
        data: result,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        const error: AppError = new Error("User not authenticated") as AppError;
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        error.isOperational = true;
        throw error;
      }

      const user = await authService.getUserProfile(userId);

      if (!user) {
        const error: AppError = new Error("User not found") as AppError;
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.isOperational = true;
        throw error;
      }

      const response: ApiResponse<typeof user> = {
        success: true,
        message: "Profile retrieved successfully",
        data: user,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout user (client-side token removal)
   * POST /api/auth/logout
   */
  public logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Since we're using JWT, logout is handled client-side by removing the token
      // This endpoint just confirms the logout action

      const response: ApiResponse<null> = {
        success: true,
        message: "Logout successful",
        data: null,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verify token endpoint
   * GET /api/auth/verify
   */
  public verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        const error: AppError = new Error("Invalid token") as AppError;
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        error.isOperational = true;
        throw error;
      }

      const user = await authService.getUserProfile(userId);

      if (!user) {
        const error: AppError = new Error("User not found") as AppError;
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.isOperational = true;
        throw error;
      }

      const response: ApiResponse<typeof user> = {
        success: true,
        message: "Token is valid",
        data: user,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  public updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        const error: AppError = new Error("User not authenticated") as AppError;
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        error.isOperational = true;
        throw error;
      }

      const updateData = req.body;

      // Validate required fields
      if (
        !updateData.username &&
        !updateData.email &&
        !updateData.newPassword
      ) {
        const error: AppError = new Error(
          "Pls update At least one field (username, email, or newPassword) "
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Validate email format if provided
      if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          const error: AppError = new Error("Invalid email format") as AppError;
          error.statusCode = HTTP_STATUS.BAD_REQUEST;
          error.isOperational = true;
          throw error;
        }
      }

      // Validate username if provided
      if (updateData.username && updateData.username.length < 3) {
        const error: AppError = new Error(
          "Username must be at least 3 characters long"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Validate new password if provided
      if (updateData.newPassword && updateData.newPassword.length < 6) {
        const error: AppError = new Error(
          "New password must be at least 6 characters long"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Update profile
      const updatedUser = await authService.updateProfile(userId, updateData);

      const response: ApiResponse<typeof updatedUser> = {
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user account (soft delete)
   * DELETE /api/auth/account
   */
  public deleteAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        const error: AppError = new Error("User not authenticated") as AppError;
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        error.isOperational = true;
        throw error;
      }

      // Delete account
      const result = await authService.deleteAccount(userId);

      if (result) {
        const response: ApiResponse<null> = {
          success: true,
          message: "Account deleted successfully",
          data: null,
        };

        res.status(HTTP_STATUS.OK).json(response);
      } else {
        const error: AppError = new Error(
          "Failed to delete account"
        ) as AppError;
        error.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        error.isOperational = true;
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all users with search and filter
   * GET /api/auth/users?search=john&role=user&limit=10&offset=0&sortBy=username&sortOrder=ASC
   */
  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
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
        const error: AppError = new Error(
          "Limit must be a number between 1 and 100"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      if (isNaN(parsedOffset) || parsedOffset < 0) {
        const error: AppError = new Error(
          "Offset must be a non-negative number"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      if (role && !["user", "admin"].includes(role as string)) {
        const error: AppError = new Error(
          "Role must be either 'user' or 'admin'"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      if (
        sortBy &&
        !["username", "email", "created_at", "updated_at"].includes(
          sortBy as string
        )
      ) {
        const error: AppError = new Error(
          "sortBy must be one of: username, email, created_at, updated_at"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      if (sortOrder && !["ASC", "DESC"].includes(sortOrder as string)) {
        const error: AppError = new Error(
          "sortOrder must be either 'ASC' or 'DESC'"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      const result = await authService.getAllUsers({
        search: search as string,
        role: role as "user" | "admin",
        limit: parsedLimit,
        offset: parsedOffset,
        sortBy: sortBy as "username" | "email" | "created_at" | "updated_at",
        sortOrder: sortOrder as "ASC" | "DESC",
      });

      const response: ApiResponse<typeof result> = {
        success: true,
        message: "Users retrieved successfully",
        data: result,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user by ID
   * GET /api/auth/users/:id
   */
  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        const error: AppError = new Error("User ID is required") as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      const user = await authService.getUserById(id);

      if (!user) {
        const error: AppError = new Error("User not found") as AppError;
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.isOperational = true;
        throw error;
      }

      const response: ApiResponse<typeof user> = {
        success: true,
        message: "User retrieved successfully",
        data: user,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
