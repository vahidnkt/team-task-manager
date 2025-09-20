import bcrypt from "bcrypt";
import jwtService from "../config/jwt";
import { userService } from "./userService";
import {
  CreateUserRequest,
  LoginRequest,
  AuthResponse,
  UserWithoutPassword,
} from "../types";
import { logger } from "../utils/logger";
import { HTTP_STATUS } from "../utils/constants";
import { AppError } from ".././types/common.types";

class AuthService {
  private readonly saltRounds: number;

  constructor() {
    this.saltRounds = 12; // This should come from config
  }

  /**
   * Register a new user
   */
  public async register(userData: CreateUserRequest): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await userService.getUserByEmail(userData.email);
      if (existingUser) {
        const error: AppError = new Error(
          "User with this email already exists"
        ) as AppError;
        error.statusCode = HTTP_STATUS.CONFLICT;
        error.isOperational = true;
        logger.warn("Registration attempt with existing email", {
          email: userData.email,
        });
        throw error;
      }

      // Check if username already exists
      const existingUsername = await userService.getUserByUsername(
        userData.username
      );
      if (existingUsername) {
        const error: AppError = new Error("Username already taken") as AppError;
        error.statusCode = HTTP_STATUS.CONFLICT;
        error.isOperational = true;
        logger.warn("Registration attempt with existing username", {
          username: userData.username,
        });
        throw error;
      }

      // Create user using userService
      const newUser = await userService.createUser(userData);

      // Generate token
      const token = jwtService.generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });

      // Return user without password
      const userWithoutPassword: UserWithoutPassword = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.createdAt,
        updated_at: newUser.updatedAt,
        deleted_at: newUser.deletedAt,
      };

      logger.info("User registered successfully", {
        userId: newUser.id,
        email: newUser.email,
      });
      return {
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }
      logger.error("Registration error", error as Error);
      throw new Error("Registration failed");
    }
  }

  /**
   * Login user
   */
  public async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await userService.getUserByEmail(loginData.email);
      if (!user) {
        const error: AppError = new Error(
          "Invalid email or password"
        ) as AppError;
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        error.isOperational = true;
        logger.warn("Login attempt with non-existent email", {
          email: loginData.email,
        });
        throw error;
      }

      // Check if user is soft deleted
      if (user.deletedAt) {
        const error: AppError = new Error(
          "Account has been deactivated"
        ) as AppError;
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        error.isOperational = true;
        logger.warn("Login attempt with deactivated account", {
          email: loginData.email,
        });
        throw error;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        loginData.password,
        user.passwordHash
      );
      if (!isPasswordValid) {
        const error: AppError = new Error(
          "Invalid email or password"
        ) as AppError;
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        error.isOperational = true;
        logger.warn("Login attempt with invalid password", {
          email: loginData.email,
        });
        throw error;
      }

      // Generate token
      const token = jwtService.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Return user without password
      const userWithoutPassword: UserWithoutPassword = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        deleted_at: user.deletedAt,
      };

      logger.info("User logged in successfully", {
        userId: user.id,
        email: user.email,
      });
      return {
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }
      logger.error("Login error", error as Error);
      throw new Error("Login failed");
    }
  }

  /**
   * Get user profile (without password)
   */
  public async getUserProfile(
    userId: string
  ): Promise<UserWithoutPassword | null> {
    try {
      const user = await userService.getUserById(userId);
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        deleted_at: user.deletedAt,
      };
    } catch (error) {
      logger.error("Get user profile error", error as Error);
      throw new Error("Failed to get user profile");
    }
  }

  /**
   * Verify password
   */
  public async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      logger.error("Password verification error", error as Error);
      return false;
    }
  }

  /**
   * Hash password
   */
  public async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      logger.error("Password hashing error", error as Error);
      throw new Error("Failed to hash password");
    }
  }
}

export default new AuthService();
