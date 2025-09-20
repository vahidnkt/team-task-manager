import bcrypt from "bcrypt";
import { UserModel } from "../models/User";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types/user.types";
import { environment } from "../config/environment";

export class UserService {
  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    return await UserModel.findAll();
  }

  // Get user by ID
  async getUserById(id: number): Promise<User | null> {
    return await UserModel.findById(id);
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    return await UserModel.findByEmail(email);
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<User | null> {
    return await UserModel.findByUsername(username);
  }

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<User> {
    const { username, email, password, role = "user" } = userData;

    // Check if user already exists
    const existingUserByEmail = await this.getUserByEmail(email);
    if (existingUserByEmail) {
      throw new Error("User with this email already exists");
    }

    const existingUserByUsername = await this.getUserByUsername(username);
    if (existingUserByUsername) {
      throw new Error("User with this username already exists");
    }

    // Hash password
    const saltRounds = environment.bcryptSaltRounds || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return newUser;
  }

  // Update user
  async updateUser(
    id: number,
    updateData: UpdateUserRequest
  ): Promise<User | null> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Check for email uniqueness if email is being updated
    if (updateData.email && updateData.email !== existingUser.email) {
      const userWithEmail = await this.getUserByEmail(updateData.email);
      if (userWithEmail && userWithEmail.id !== id) {
        throw new Error("Email already in use by another user");
      }
    }

    // Check for username uniqueness if username is being updated
    if (updateData.username && updateData.username !== existingUser.username) {
      const userWithUsername = await this.getUserByUsername(
        updateData.username
      );
      if (userWithUsername && userWithUsername.id !== id) {
        throw new Error("Username already in use by another user");
      }
    }

    // Hash password if it's being updated
    if (updateData.password) {
      const saltRounds = environment.bcryptSaltRounds || 12;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    return await UserModel.update(id, updateData);
  }

  // Delete user (soft delete)
  async deleteUser(id: number): Promise<boolean> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    return await UserModel.delete(id);
  }

  // Verify user password
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await UserModel.findByEmailWithPassword(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return null;
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  // Change user password
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await UserModel.findByIdWithPassword(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const saltRounds = environment.bcryptSaltRounds || 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    const updated = await UserModel.update(userId, {
      password: hashedNewPassword,
    });
    return !!updated;
  }

  // Get user statistics
  async getUserStats(userId: number): Promise<any> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // This would be implemented with actual database queries
    // For now, returning placeholder data
    return {
      user_id: userId,
      total_projects_created: 0,
      total_tasks_assigned: 0,
      total_tasks_completed: 0,
      total_comments_made: 0,
      account_created: user.created_at,
      last_active: user.updated_at,
    };
  }

  // Search users by username or email (admin only)
  async searchUsers(searchTerm: string, limit: number = 20): Promise<User[]> {
    return await UserModel.searchByUsernameOrEmail(searchTerm, limit);
  }

  // Get users by role
  async getUsersByRole(role: "user" | "admin"): Promise<User[]> {
    return await UserModel.findByRole(role);
  }

  // Activate/deactivate user (admin only)
  async toggleUserStatus(
    userId: number,
    isActive: boolean
  ): Promise<User | null> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // This would require adding an 'active' field to the user model
    // For now, we'll just return the user as is
    return user;
  }

  // Get recent users (admin only)
  async getRecentUsers(limit: number = 10): Promise<User[]> {
    return await UserModel.findRecent(limit);
  }

  // Validate user permissions
  validateUserPermissions(
    currentUser: User,
    targetUserId: number,
    requiredRole?: "admin"
  ): boolean {
    // Admin can access all users
    if (currentUser.role === "admin") {
      return true;
    }

    // If admin role is required and user is not admin
    if (requiredRole === "admin") {
      return false;
    }

    // User can only access their own data
    return currentUser.id === targetUserId;
  }

  // Check if user exists
  async userExists(userId: number): Promise<boolean> {
    const user = await this.getUserById(userId);
    return !!user;
  }

  // Get user's assigned tasks count
  async getUserTaskCount(userId: number): Promise<number> {
    // This would require a join with tasks table
    // Placeholder implementation
    return 0;
  }

  // Get user's project count
  async getUserProjectCount(userId: number): Promise<number> {
    // This would require a join with projects table
    // Placeholder implementation
    return 0;
  }
}

export const userService = new UserService();
