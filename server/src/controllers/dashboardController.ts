import { Request, Response } from "express";
import dashboardService from "../services/dashboardService";
import { AuthRequest } from "../types/auth.types";
import { ApiResponse } from "../types/api.types";
import { HTTP_STATUS } from "../utils/constants";
import { DashboardQueryDto } from "../dto/dashboard.dto";

export class DashboardController {
  // Single comprehensive dashboard endpoint
  async getDashboard(req: AuthRequest, res: Response): Promise<void> {
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
        recentTasksLimit,
        recentTasksOffset,
        recentActivitiesLimit,
        recentActivitiesOffset,
        projectsLimit,
        projectsOffset,
        projectsStatus,
        includeStats,
        includeRecentTasks,
        includeRecentActivities,
        includeProjects,
      } = req.query;

      // Prepare options for the service
      const options = {
        statsDays: statsDays ? parseInt(statsDays as string) : 30,
        recentTasksLimit: recentTasksLimit
          ? parseInt(recentTasksLimit as string)
          : 10,
        recentTasksOffset: recentTasksOffset
          ? parseInt(recentTasksOffset as string)
          : 0,
        recentActivitiesLimit: recentActivitiesLimit
          ? parseInt(recentActivitiesLimit as string)
          : 10,
        recentActivitiesOffset: recentActivitiesOffset
          ? parseInt(recentActivitiesOffset as string)
          : 0,
        projectsLimit: projectsLimit ? parseInt(projectsLimit as string) : 20,
        projectsOffset: projectsOffset ? parseInt(projectsOffset as string) : 0,
        projectsStatus: (projectsStatus as string) || "all",
        includeStats: includeStats !== "false",
        includeRecentTasks: includeRecentTasks !== "false",
        includeRecentActivities: includeRecentActivities !== "false",
        includeProjects: includeProjects !== "false",
      };

      const dashboardData = await dashboardService.getCompleteDashboardData(
        req.user.userId,
        req.user.role,
        options
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
}

export const dashboardController = new DashboardController();
