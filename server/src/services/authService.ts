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
   * Update user profile
   */
  public async updateProfile(
    userId: string,
    updateData: {
      username?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    }
  ): Promise<UserWithoutPassword> {
    try {
      // Get current user
      const currentUser = await userService.getUserById(userId);
      if (!currentUser) {
        const error: AppError = new Error("User not found") as AppError;
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.isOperational = true;
        throw error;
      }

      // If password is being updated, verify current password
      if (updateData.newPassword) {
        if (!updateData.currentPassword) {
          const error: AppError = new Error(
            "Current password is required to change password"
          ) as AppError;
          error.statusCode = HTTP_STATUS.BAD_REQUEST;
          error.isOperational = true;
          throw error;
        }

        const isCurrentPasswordValid = await this.verifyPassword(
          updateData.currentPassword,
          currentUser.passwordHash
        );
        if (!isCurrentPasswordValid) {
          const error: AppError = new Error(
            "Current password is incorrect"
          ) as AppError;
          error.statusCode = HTTP_STATUS.BAD_REQUEST;
          error.isOperational = true;
          throw error;
        }
      }

      // Prepare update data
      const updatePayload: any = {};

      if (updateData.username) {
        updatePayload.username = updateData.username;
      }

      if (updateData.email) {
        updatePayload.email = updateData.email;
      }

      if (updateData.newPassword) {
        updatePayload.password = updateData.newPassword;
      }

      // Update user
      const updatedUser = await userService.updateUser(userId, updatePayload);
      if (!updatedUser) {
        const error: AppError = new Error(
          "Failed to update profile"
        ) as AppError;
        error.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        error.isOperational = true;
        throw error;
      }

      // Return user without password
      const userWithoutPassword: UserWithoutPassword = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        created_at: updatedUser.createdAt,
        updated_at: updatedUser.updatedAt,
        deleted_at: updatedUser.deletedAt,
      };

      logger.info("User profile updated successfully", {
        userId: updatedUser.id,
        updatedFields: Object.keys(updatePayload),
      });

      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }
      logger.error("Profile update error", error as Error);
      throw new Error("Failed to update profile");
    }
  }

  /**
   * Soft delete user account
   */
  public async deleteAccount(userId: string): Promise<boolean> {
    try {
      const user = await userService.getUserById(userId);
      if (!user) {
        const error: AppError = new Error("User not found") as AppError;
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.isOperational = true;
        throw error;
      }

      // Check if user is already deleted
      if (user.deletedAt) {
        const error: AppError = new Error(
          "Account is already deleted"
        ) as AppError;
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.isOperational = true;
        throw error;
      }

      // Soft delete user
      const result = await userService.deleteUser(userId);

      if (result) {
        logger.info("User account deleted successfully", {
          userId: userId,
          email: user.email,
        });
        return true;
      } else {
        const error: AppError = new Error(
          "Failed to delete account"
        ) as AppError;
        error.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        error.isOperational = true;
        throw error;
      }
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }
      logger.error("Account deletion error", error as Error);
      throw new Error("Failed to delete account");
    }
  }

  /**
   * Get all users with search and filter options
   */
  public async getAllUsers(
    options: {
      search?: string;
      role?: "user" | "admin";
      limit?: number;
      offset?: number;
      sortBy?: "username" | "email" | "created_at" | "updated_at";
      sortOrder?: "ASC" | "DESC";
    } = {}
  ): Promise<{
    users: UserWithoutPassword[];
    total: number;
    limit: number;
    offset: number;
  }> {
    try {
      const {
        search = "",
        role,
        limit = 20,
        offset = 0,
        sortBy = "created_at",
        sortOrder = "DESC",
      } = options;

      // Build search conditions
      const searchConditions: any = {};

      if (search) {
        searchConditions[require("sequelize").Op.or] = [
          { username: { [require("sequelize").Op.like]: `%${search}%` } },
          { email: { [require("sequelize").Op.like]: `%${search}%` } },
        ];
      }

      if (role) {
        searchConditions.role = role;
      }

      // Get users with search and filter
      const { count, rows: users } = await userService.getAllUsersWithFilter({
        where: searchConditions,
        limit: Math.min(limit, 100), // Max 100 users per request
        offset,
        order: [[sortBy, sortOrder]],
      });

      // Convert to users without passwords
      const usersWithoutPasswords: UserWithoutPassword[] = users.map(
        (user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
          deleted_at: user.deletedAt,
        })
      );

      logger.info("Retrieved users with filters", {
        count: usersWithoutPasswords.length,
        total: count,
        search,
        role,
        limit,
        offset,
      });

      return {
        users: usersWithoutPasswords,
        total: count,
        limit,
        offset,
      };
    } catch (error) {
      logger.error("Get all users error", error as Error);
      throw new Error("Failed to get users");
    }
  }

  /**
   * Get user by ID (without password)
   */
  public async getUserById(
    userId: string
  ): Promise<UserWithoutPassword | null> {
    try {
      const user = await userService.getUserById(userId);

      if (!user) {
        return null;
      }

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

      logger.info("Retrieved user by ID", {
        userId: userId,
      });

      return userWithoutPassword;
    } catch (error) {
      logger.error("Get user by ID error", error as Error);
      throw new Error("Failed to get user");
    }
  }
}

export default new AuthService();
