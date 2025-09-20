import bcrypt from "bcrypt";
import jwtService from "../config/jwt";
import { UserModel } from "../models";
import {
  User,
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
      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        const error: AppError = new Error(
          "User with this email already exists"
        ) as AppError;
        error.statusCode = 409;
        error.isOperational = true;
        throw error;
      }

      // Check if username already exists
      const existingUsername = await UserModel.findByUsername(
        userData.username
      );
      if (existingUsername) {
        const error: AppError = new Error("Username already taken") as AppError;
        error.statusCode = 409;
        error.isOperational = true;
        throw error;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(
        userData.password,
        this.saltRounds
      );

      // Create user using model
      const newUser = await UserModel.create({
        ...userData,
        password_hash: passwordHash,
      });

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
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
        deleted_at: newUser.deleted_at,
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
      const user = await UserModel.findByEmail(loginData.email);
      if (!user) {
        const error: AppError = new Error(
          "Invalid email or password"
        ) as AppError;
        error.statusCode = 401;
        error.isOperational = true;
        throw error;
      }

      // Check if user is soft deleted
      if (user.deleted_at) {
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
        user.password_hash
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
        created_at: user.created_at,
        updated_at: user.updated_at,
        deleted_at: user.deleted_at,
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
      const user = await UserModel.findById(userId);
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
        deleted_at: user.deleted_at,
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
