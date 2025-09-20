import bcrypt from "bcrypt";
import jwtService from "../config/jwt";
import { userService } from "./userService";
import {
  CreateUserRequest,
  LoginRequest,
  AuthResponse,
  UserWithoutPassword,
} from "../types";
import { AppError } from "../types";

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
        error.statusCode = 409;
        error.isOperational = true;
        throw error;
      }

      // Check if username already exists
      const existingUsername = await userService.getUserByUsername(
        userData.username
      );
      if (existingUsername) {
        const error: AppError = new Error("Username already taken") as AppError;
        error.statusCode = 409;
        error.isOperational = true;
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

      return {
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }
      console.error("Registration error:", error);
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
        error.statusCode = 401;
        error.isOperational = true;
        throw error;
      }

      // Check if user is soft deleted
      if (user.deletedAt) {
        const error: AppError = new Error(
          "Account has been deactivated"
        ) as AppError;
        error.statusCode = 401;
        error.isOperational = true;
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
        error.statusCode = 401;
        error.isOperational = true;
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

      return {
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
  }

  /**
   * Get user profile (without password)
   */
  public async getUserProfile(
    userId: number
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
      console.error("Get user profile error:", error);
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
      console.error("Password verification error:", error);
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
      console.error("Password hashing error:", error);
      throw new Error("Failed to hash password");
    }
  }
}

export default new AuthService();