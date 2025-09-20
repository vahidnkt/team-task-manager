import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import { CreateUserRequest, LoginRequest, AuthResponse } from "../types";
import { AppError, ApiResponse } from "../types";

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
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        const error: AppError = new Error("Invalid email format") as AppError;
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
      }

      // Validate password strength
      if (userData.password.length < 6) {
        const error: AppError = new Error(
          "Password must be at least 6 characters long"
        ) as AppError;
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
      }

      // Validate username
      if (userData.username.length < 3) {
        const error: AppError = new Error(
          "Username must be at least 3 characters long"
        ) as AppError;
        error.statusCode = 400;
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

      res.status(201).json(response);
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
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginData.email)) {
        const error: AppError = new Error("Invalid email format") as AppError;
        error.statusCode = 400;
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

      res.status(200).json(response);
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
        error.statusCode = 401;
        error.isOperational = true;
        throw error;
      }

      const user = await authService.getUserProfile(userId);

      if (!user) {
        const error: AppError = new Error("User not found") as AppError;
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
      }

      const response: ApiResponse<typeof user> = {
        success: true,
        message: "Profile retrieved successfully",
        data: user,
      };

      res.status(200).json(response);
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

      res.status(200).json(response);
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
        error.statusCode = 401;
        error.isOperational = true;
        throw error;
      }

      const user = await authService.getUserProfile(userId);

      if (!user) {
        const error: AppError = new Error("User not found") as AppError;
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
      }

      const response: ApiResponse<typeof user> = {
        success: true,
        message: "Token is valid",
        data: user,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
