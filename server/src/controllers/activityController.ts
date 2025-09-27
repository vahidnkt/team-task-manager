import { Request, Response } from "express";
import { activityService } from "../services/activityService";
import { AuthRequest } from "../types/auth.types";
import { ApiResponse } from "../types/api.types";
import { HTTP_STATUS } from "../utils/constants";

export class ActivityController {
  // Get project activity history
  async getProjectActivities(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const { limit, offset } = req.query;

      if (!projectId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      const activities = await activityService.getProjectActivities(
        projectId,
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );

      const response: ApiResponse = {
        success: true,
        data: activities,
        message: "Project activities retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
        res.status(HTTP_STATUS.FORBIDDEN).json({
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
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
      const { id: userId } = req.params;
      const { limit, offset } = req.query;

      if (!userId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "User ID is required",
        });
        return;
      }

      // Check if user can view these activities
      if (req.user?.role !== "admin" && req.user?.userId !== userId) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: "Not authorized to view these activities",
        });
        return;
      }

      const activities = await activityService.getUserActivities(
        userId,
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );

      const response: ApiResponse = {
        success: true,
        data: activities,
        message: "User activities retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const activities = await activityService.getTaskActivities(
        taskId,
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );

      const response: ApiResponse = {
        success: true,
        data: activities,
        message: "Task activities retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      const stats = await activityService.getProjectActivityStats(
        projectId,
        days ? parseInt(days as string) : 30
      );

      const response: ApiResponse = {
        success: true,
        data: stats,
        message: "Project activity statistics retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
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
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve activity summary",
      });
    }
  }

  // Delete activity (admin only)
  async deleteActivity(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Activity ID is required",
        });
        return;
      }

      const deleted = await activityService.deleteActivity(id);

      if (!deleted) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Activity not found",
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { id },
        message: "Activity deleted successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete activity",
      });
    }
  }

  // Update activity (admin only)
  async updateActivity(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { action, description } = req.body;

      if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Activity ID is required",
        });
        return;
      }

      const updatedActivity = await activityService.updateActivity(id, {
        action,
        description,
      });

      if (!updatedActivity) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Activity not found",
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: updatedActivity,
        message: "Activity updated successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update activity",
      });
    }
  }
}

export const activityController = new ActivityController();
