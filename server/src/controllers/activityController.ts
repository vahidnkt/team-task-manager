import { Request, Response } from "express";
import { activityService } from "../services/activityService";
import { AuthRequest } from "../types/auth.types";
import { ApiResponse } from "../types/api.types";

export class ActivityController {
  // Get project activity history
  async getProjectActivities(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const { limit, offset } = req.query;

      if (!projectId) {
        res.status(400).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      const activities = await activityService.getProjectActivities(
        parseInt(projectId),
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );

      const response: ApiResponse = {
        success: true,
        data: activities,
        message: "Project activities retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve project activities",
      });
    }
  }

  // Get recent activities (admin only)
  async getRecentActivities(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (req.user?.role !== "admin") {
        res.status(403).json({
          success: false,
          message: "Admin access required",
        });
        return;
      }

      const { limit, offset } = req.query;

      const activities = await activityService.getRecentActivities(
        limit ? parseInt(limit as string) : 50,
        offset ? parseInt(offset as string) : 0
      );

      const response: ApiResponse = {
        success: true,
        data: activities,
        message: "Recent activities retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve recent activities",
      });
    }
  }

  // Get activities by user
  async getUserActivities(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { limit, offset } = req.query;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID is required",
        });
        return;
      }

      // Check if user can view these activities
      if (req.user?.role !== "admin" && req.user?.userId !== parseInt(userId)) {
        res.status(403).json({
          success: false,
          message: "Not authorized to view these activities",
        });
        return;
      }

      const activities = await activityService.getUserActivities(
        parseInt(userId),
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );

      const response: ApiResponse = {
        success: true,
        data: activities,
        message: "User activities retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve user activities",
      });
    }
  }

  // Get activities by task
  async getTaskActivities(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const { limit, offset } = req.query;

      if (!taskId) {
        res.status(400).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const activities = await activityService.getTaskActivities(
        parseInt(taskId),
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );

      const response: ApiResponse = {
        success: true,
        data: activities,
        message: "Task activities retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve task activities",
      });
    }
  }

  // Get activity statistics for a project
  async getProjectActivityStats(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { projectId } = req.params;
      const { days } = req.query;

      if (!projectId) {
        res.status(400).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      const stats = await activityService.getProjectActivityStats(
        parseInt(projectId),
        days ? parseInt(days as string) : 30
      );

      const response: ApiResponse = {
        success: true,
        data: stats,
        message: "Project activity statistics retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve activity statistics",
      });
    }
  }

  // Get user activity summary
  async getUserActivitySummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const { days } = req.query;

      const summary = await activityService.getUserActivitySummary(
        req.user.userId,
        days ? parseInt(days as string) : 7
      );

      const response: ApiResponse = {
        success: true,
        data: summary,
        message: "User activity summary retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve activity summary",
      });
    }
  }
}

export const activityController = new ActivityController();
