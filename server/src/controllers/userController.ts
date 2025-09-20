import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { AuthRequest } from '../types/auth.types';
import { ApiResponse } from '../types/api.types';

export class UserController {
  // Get all users (admin only)
  async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      const response: ApiResponse = {
        success: true,
        data: users,
        message: 'Users retrieved successfully'
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve users'
      });
    }
  }

  // Get specific user by ID
  async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const user = await userService.getUserById(parseInt(id));

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: user,
        message: 'User retrieved successfully'
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve user'
      });
    }
  }

  // Update user
  async updateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      // Check if user can update this profile
      if (req.user?.role !== 'admin' && req.user?.userId !== parseInt(id)) {
        res.status(403).json({
          success: false,
          message: 'Not authorized to update this user'
        });
        return;
      }

      const updatedUser = await userService.updateUser(parseInt(id), updateData);

      const response: ApiResponse = {
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user'
      });
    }
  }

  // Delete user (admin only)
  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      // Prevent admin from deleting themselves
      if (req.user?.userId === parseInt(id)) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
        return;
      }

      await userService.deleteUser(parseInt(id));

      const response: ApiResponse = {
        success: true,
        message: 'User deleted successfully'
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete user'
      });
    }
  }

  // Get current user profile
  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const user = await userService.getUserById(req.user.userId);

      const response: ApiResponse = {
        success: true,
        data: user,
        message: 'Current user retrieved successfully'
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve current user'
      });
    }
  }
}

export const userController = new UserController();