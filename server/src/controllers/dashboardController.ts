import { Request, Response } from "express";
import dashboardService from "../services/dashboardService";
import { AuthRequest } from "../types/auth.types";
import { ApiResponse } from "../types/api.types";
import { HTTP_STATUS } from "../utils/constants";
import {
  DashboardStatsQueryDto,
  DashboardRecentQueryDto,
  DashboardProjectsQueryDto,
  DashboardDataQueryDto,
} from "../dto/dashboard.dto";

export class DashboardController {
  // Get complete dashboard data
  async getDashboardData(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const {
        statsDays,
        recentLimit,
        recentOffset,
        projectsLimit,
        projectsOffset,
      } = req.query;

      const dashboardData = await dashboardService.getDashboardData(
        req.user.userId,
        req.user.role,
        {
          statsDays: statsDays ? parseInt(statsDays as string) : 30,
          recentLimit: recentLimit ? parseInt(recentLimit as string) : 10,
          recentOffset: recentOffset ? parseInt(recentOffset as string) : 0,
          projectsLimit: projectsLimit ? parseInt(projectsLimit as string) : 20,
          projectsOffset: projectsOffset
            ? parseInt(projectsOffset as string)
            : 0,
        }
      );

      const response: ApiResponse = {
        success: true,
        data: dashboardData,
        message: "Dashboard data retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve dashboard data",
      });
    }
  }

  // Get dashboard statistics
  async getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const { days } = req.query;

      const stats = await dashboardService.getDashboardStats(
        req.user.userId,
        req.user.role,
        days ? parseInt(days as string) : 30
      );

      const response: ApiResponse = {
        success: true,
        data: stats,
        message: "Dashboard statistics retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve dashboard statistics",
      });
    }
  }

  // Get recent tasks
  async getRecentTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const { limit, offset } = req.query;

      const recentTasks = await dashboardService.getRecentTasks(
        req.user.userId,
        req.user.role,
        limit ? parseInt(limit as string) : 10,
        offset ? parseInt(offset as string) : 0
      );

      const response: ApiResponse = {
        success: true,
        data: recentTasks,
        message: "Recent tasks retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve recent tasks",
      });
    }
  }

  // Get recent activities
  async getRecentActivities(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const { limit, offset } = req.query;

      const recentActivities = await dashboardService.getRecentActivities(
        req.user.userId,
        req.user.role,
        limit ? parseInt(limit as string) : 10,
        offset ? parseInt(offset as string) : 0
      );

      const response: ApiResponse = {
        success: true,
        data: recentActivities,
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

  // Get projects overview
  async getProjects(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const { limit, offset, status } = req.query;

      const projects = await dashboardService.getProjects(
        req.user.userId,
        req.user.role,
        limit ? parseInt(limit as string) : 20,
        offset ? parseInt(offset as string) : 0
      );

      // Filter by status if provided
      let filteredProjects = projects;
      if (status) {
        filteredProjects = projects.filter((project) => {
          if (status === "active") {
            return project.progressPercentage < 100;
          } else if (status === "completed") {
            return project.progressPercentage === 100;
          }
          return true;
        });
      }

      const response: ApiResponse = {
        success: true,
        data: filteredProjects,
        message: "Projects retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve projects",
      });
    }
  }

  // Get user activity summary (for personal dashboard)
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

      // This method can be used for additional user-specific analytics
      const summary = {
        userId: req.user.userId,
        periodDays: days ? parseInt(days as string) : 7,
        message:
          "User activity summary endpoint - implement specific logic as needed",
      };

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
            : "Failed to retrieve user activity summary",
      });
    }
  }
}

export const dashboardController = new DashboardController();
