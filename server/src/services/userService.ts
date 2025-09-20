import bcrypt from "bcrypt";
import { User } from "../models/User";
import { CreateUserRequest, UpdateUserRequest } from "../types/user.types";
import environment from "../config/environment";

export class UserService {
  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    return await User.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({
      where: { email },
    });
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<User | null> {
    return await User.findOne({
      where: { username },
    });
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
    const saltRounds = environment.security.bcryptSaltRounds || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user using Sequelize
    return await User.create({
      username,
      email,
      passwordHash: hashedPassword,
      role,
    } as any);
  }

  // Update user
  async updateUser(
    id: string,
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
      const saltRounds = environment.security.bcryptSaltRounds || 12;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    // Update user using Sequelize
    await User.update(
      {
        ...updateData,
        passwordHash: updateData.password || undefined,
      },
      { where: { id } }
    );

    return await this.getUserById(id);
  }

  // Delete user (soft delete)
  async deleteUser(id: string): Promise<boolean> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    await User.destroy({ where: { id } });
    return true;
  }

  // Verify user password
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword as User;
  }

  // Change user password
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const saltRounds = environment.security.bcryptSaltRounds || 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.update(
      { passwordHash: hashedNewPassword },
      { where: { id: userId } }
    );
    return true;
  }

  // Get user statistics
  async getUserStats(userId: string): Promise<any> {
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
      account_created: user.createdAt,
      last_active: user.updatedAt,
    };
  }

  // Search users by username or email (admin only)
  async searchUsers(searchTerm: string, limit: number = 20): Promise<User[]> {
    return await User.findAll({
      where: {
        [require("sequelize").Op.or]: [
          { username: { [require("sequelize").Op.like]: `%${searchTerm}%` } },
          { email: { [require("sequelize").Op.like]: `%${searchTerm}%` } },
        ],
      },
      limit,
      order: [["createdAt", "DESC"]],
    });
  }

  // Get users by role
  async getUsersByRole(role: "user" | "admin"): Promise<User[]> {
    return await User.findAll({
      where: { role },
      order: [["createdAt", "DESC"]],
    });
  }

  // Activate/deactivate user (admin only)
  async toggleUserStatus(
    userId: string,
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
    return await User.findAll({
      order: [["createdAt", "DESC"]],
      limit,
    });
  }

  // Validate user permissions
  validateUserPermissions(
    currentUser: User,
    targetUserId: string,
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
  async userExists(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    return !!user;
  }

  // Get user's assigned tasks count
  async getUserTaskCount(userId: string): Promise<number> {
    return await User.count({
      include: [
        {
          model: require("../models/Task").Task,
          as: "assignedTasks",
          required: false,
        },
      ],
      where: { id: userId },
    });
  }

  // Get user's project count
  async getUserProjectCount(userId: string): Promise<number> {
    return await User.count({
      include: [
        {
          model: require("../models/Project").Project,
          as: "createdProjects",
          required: false,
        },
      ],
      where: { id: userId },
    });
  }
}

export const userService = new UserService();
