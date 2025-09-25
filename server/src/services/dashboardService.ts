import { Op } from "sequelize";
import { Task } from "../models/Task";
import { Project } from "../models/Project";
import { User } from "../models/User";
import { Activity } from "../models/Activity";
import {
  DashboardStatsResponseDto,
  DashboardRecentTaskDto,
  DashboardRecentActivityDto,
  DashboardProjectDto,
  DashboardResponseDto,
} from "../dto/dashboard.dto";
import { logger } from "../utils/logger";
import { HTTP_STATUS } from "../utils/constants";
import { AppError } from "../types/common.types";

class DashboardService {
  /**
   * Get admin statistics (system-wide)
   */
  private async getAdminStats(
    startDate: Date
  ): Promise<DashboardStatsResponseDto> {
    try {
      // Get basic counts first
      const [
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        totalProjects,
        totalUsers,
      ] = await Promise.all([
        // Task statistics
        Task.count({ where: { deletedAt: null } as any }),
        Task.count({ where: { status: "done", deletedAt: null } as any }),
        Task.count({
          where: { status: "in-progress", deletedAt: null } as any,
        }),
        Task.count({
          where: {
            dueDate: { [Op.lt]: new Date() },
            status: { [Op.ne]: "done" },
            deletedAt: null,
          } as any,
        }),
        // Project statistics
        Project.count({ where: { deletedAt: null } as any }),
        // User statistics
        User.count({ where: { deletedAt: null } as any }),
      ]);

      // Get project status counts separately to avoid complex joins
      const [activeProjects, completedProjects, activeUsers] =
        await Promise.all([
          // Count projects with active tasks (not all done)
          Project.count({
            where: { deletedAt: null } as any,
            include: [
              {
                model: Task,
                as: "tasks",
                where: {
                  status: { [Op.ne]: "done" },
                  deletedAt: null,
                } as any,
                required: true,
              },
            ],
          }),
          // Count projects where all tasks are done
          Project.count({
            where: { deletedAt: null } as any,
            include: [
              {
                model: Task,
                as: "tasks",
                where: {
                  status: "done",
                  deletedAt: null,
                } as any,
                required: true,
              },
            ],
          }),
          // Count active users (users with recent activities)
          User.count({
            where: { deletedAt: null } as any,
            include: [
              {
                model: Activity,
                as: "activities",
                where: {
                  createdAt: { [Op.gte]: startDate },
                } as any,
                required: true,
              },
            ],
          }),
        ]);

      const stats = {
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        totalProjects,
        activeProjects,
        completedProjects,
        totalUsers,
        activeUsers,
      };

      logger.info("Admin statistics retrieved successfully", {
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        totalProjects,
        activeProjects,
        completedProjects,
        totalUsers,
        activeUsers,
      });

      return stats;
    } catch (error) {
      logger.error("Get admin stats error", error as Error);
      const appError: AppError = new Error(
        "Failed to get admin statistics"
      ) as AppError;
      appError.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appError.isOperational = true;
      throw appError;
    }
  }

  /**
   * Get user project data (cached to avoid duplicate queries)
   */
  private async getUserProjectData(userId: string): Promise<{
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    projectIds: string[];
  }> {
    try {
      // Get projects created by user
      const createdProjects = await Project.findAll({
        where: { createdBy: userId, deletedAt: null } as any,
        attributes: ["id"],
        raw: true,
      });

      // Get projects where user has tasks assigned
      const taskProjects = await Task.findAll({
        where: { assigneeId: userId, deletedAt: null } as any,
        attributes: ["projectId"],
        raw: true,
      });

      // Combine and deduplicate project IDs
      const allProjectIds = [
        ...createdProjects.map((p: any) => p.id),
        ...taskProjects.map((t: any) => t.projectId),
      ];
      const uniqueProjectIds = [...new Set(allProjectIds)];

      if (uniqueProjectIds.length === 0) {
        logger.info("No projects found for user", { userId });
        return {
          totalProjects: 0,
          activeProjects: 0,
          completedProjects: 0,
          projectIds: [],
        };
      }

      // Count projects with active tasks (not done)
      const activeProjects = await Project.count({
        where: {
          id: { [Op.in]: uniqueProjectIds },
          deletedAt: null,
        } as any,
        include: [
          {
            model: Task,
            as: "tasks",
            where: {
              status: { [Op.ne]: "done" },
              deletedAt: null,
            } as any,
            required: true,
          },
        ],
      });

      // Count projects with completed tasks (all done)
      const completedProjects = await Project.count({
        where: {
          id: { [Op.in]: uniqueProjectIds },
          deletedAt: null,
        } as any,
        include: [
          {
            model: Task,
            as: "tasks",
            where: {
              status: "done",
              deletedAt: null,
            } as any,
            required: true,
          },
        ],
      });

      const result = {
        totalProjects: uniqueProjectIds.length,
        activeProjects,
        completedProjects,
        projectIds: uniqueProjectIds,
      };

      logger.info("User project data retrieved successfully", {
        userId,
        totalProjects: result.totalProjects,
        activeProjects: result.activeProjects,
        completedProjects: result.completedProjects,
      });

      return result;
    } catch (error) {
      logger.error("Error getting user project data", error as Error);
      const appError: AppError = new Error(
        "Failed to get user project data"
      ) as AppError;
      appError.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appError.isOperational = true;
      throw appError;
    }
  }

  /**
   * Get recent tasks for admin (system-wide)
   */
  private async getRecentTasks(
    userId: string,
    userRole: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<DashboardRecentTaskDto[]> {
    const whereClause =
      userRole === "admin"
        ? { deletedAt: null }
        : { assigneeId: userId, deletedAt: null };

    const tasks = await Task.findAll({
      where: whereClause as any,
      include: [
        { model: Project, as: "project" },
        { model: User, as: "assignee" },
      ],
      order: [["updatedAt", "DESC"]],
      limit,
      offset,
    });

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate
        ? typeof task.dueDate === "string"
          ? task.dueDate
          : task.dueDate.toISOString()
        : undefined,
      projectId: task.projectId,
      projectName: task.project?.name || "Unknown Project",
      assigneeId: task.assigneeId,
      assigneeName: task.assignee?.username,
      createdAt: task.createdAt.toISOString(),
    }));
  }

  /**
   * Get recent activities for admin (system-wide)
   */
  private async getRecentActivities(
    userId: string,
    userRole: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<DashboardRecentActivityDto[]> {
    const whereClause = userRole === "admin" ? {} : { userId };

    const activities = await Activity.findAll({
      where: whereClause,
      include: [
        { model: User, as: "user" },
        { model: Project, as: "project" },
        { model: Task, as: "task" },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return activities.map((activity) => ({
      id: activity.id,
      action: activity.action,
      description: activity.description || "",
      userId: activity.userId,
      userName: activity.user?.username || "Unknown User",
      projectId: activity.projectId,
      projectName: activity.project?.name,
      taskId: activity.taskId,
      taskTitle: activity.task?.title,
      createdAt: activity.createdAt.toISOString(),
    }));
  }

  /**
   * Get projects for admin (system-wide)
   */
  private async getProjects(
    userId: string,
    userRole: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<DashboardProjectDto[]> {
    let projectIds: string[] = [];

    if (userRole === "admin") {
      // Admin can see all projects
      const allProjects = await Project.findAll({
        where: { deletedAt: null } as any,
        attributes: ["id"],
        raw: true,
      });
      projectIds = allProjects.map((p: any) => p.id);
    } else {
      // User can see projects they created or have tasks in
      const createdProjects = await Project.findAll({
        where: { createdBy: userId, deletedAt: null } as any,
        attributes: ["id"],
        raw: true,
      });

      const taskProjects = await Task.findAll({
        where: { assigneeId: userId, deletedAt: null } as any,
        attributes: ["projectId"],
        raw: true,
      });

      // Combine and deduplicate
      const allProjectIds = [
        ...createdProjects.map((p: any) => p.id),
        ...taskProjects.map((t: any) => t.projectId),
      ];
      projectIds = [...new Set(allProjectIds)];
    }

    if (projectIds.length === 0) {
      return [];
    }

    const projects = await Project.findAll({
      where: {
        id: { [Op.in]: projectIds },
        deletedAt: null,
      } as any,
      include: [
        { model: User, as: "creator" },
        {
          model: Task,
          as: "tasks",
          required: false,
          where: { deletedAt: null } as any,
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit,
      offset,
    });

    return projects.map((project) => {
      const tasks = project.tasks || [];
      const completedTasks = tasks.filter(
        (task) => task.status === "done"
      ).length;
      const progressPercentage =
        tasks.length > 0
          ? Math.round((completedTasks / tasks.length) * 100)
          : 0;

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        taskCount: tasks.length,
        completedTaskCount: completedTasks,
        progressPercentage,
        createdBy: project.createdBy,
        creatorName: project.creator?.username || "Unknown User",
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      };
    });
  }

  /**
   * Get complete dashboard data with flexible data inclusion
   */
  public async getCompleteDashboardData(
    userId: string,
    userRole: string,
    options: {
      statsDays?: number;
      recentTasksLimit?: number;
      recentTasksOffset?: number;
      recentActivitiesLimit?: number;
      recentActivitiesOffset?: number;
      projectsLimit?: number;
      projectsOffset?: number;
      projectsStatus?: string;
      includeStats?: boolean;
      includeRecentTasks?: boolean;
      includeRecentActivities?: boolean;
      includeProjects?: boolean;
    } = {}
  ): Promise<DashboardResponseDto> {
    try {
      const {
        statsDays = 30,
        recentTasksLimit = 10,
        recentTasksOffset = 0,
        recentActivitiesLimit = 10,
        recentActivitiesOffset = 0,
        projectsLimit = 20,
        projectsOffset = 0,
        projectsStatus = "all",
        includeStats = true,
        includeRecentTasks = true,
        includeRecentActivities = true,
        includeProjects = true,
      } = options;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - statsDays);

      // Prepare promises array based on what data to include
      const promises: Promise<any>[] = [];
      const dataKeys: string[] = [];

      if (includeStats) {
        if (userRole === "admin") {
          promises.push(this.getAdminStats(startDate));
        } else {
          promises.push(this.getUserStatsOptimized(userId, startDate));
        }
        dataKeys.push("stats");
      }

      if (includeRecentTasks) {
        if (userRole === "admin") {
          promises.push(
            this.getRecentTasks(
              userId,
              userRole,
              recentTasksLimit,
              recentTasksOffset
            )
          );
        } else {
          promises.push(
            this.getRecentTasksOptimized(
              userId,
              recentTasksLimit,
              recentTasksOffset
            )
          );
        }
        dataKeys.push("recentTasks");
      }

      if (includeRecentActivities) {
        if (userRole === "admin") {
          promises.push(
            this.getRecentActivities(
              userId,
              userRole,
              recentActivitiesLimit,
              recentActivitiesOffset
            )
          );
        } else {
          promises.push(
            this.getRecentActivitiesOptimized(
              userId,
              recentActivitiesLimit,
              recentActivitiesOffset
            )
          );
        }
        dataKeys.push("recentActivities");
      }

      if (includeProjects) {
        if (userRole === "admin") {
          promises.push(
            this.getProjects(userId, userRole, projectsLimit, projectsOffset)
          );
        } else {
          promises.push(
            this.getProjectsOptimized(userId, projectsLimit, projectsOffset)
          );
        }
        dataKeys.push("projects");
      }

      // Execute all promises in parallel
      const results = await Promise.all(promises);

      // Build response object
      const response: any = {
        metadata: {
          generatedAt: new Date().toISOString(),
          userRole,
          dataRange: {
            statsDays,
            recentTasksCount: 0,
            recentActivitiesCount: 0,
            projectsCount: 0,
          },
        },
      };

      // Map results to response object
      let resultIndex = 0;
      dataKeys.forEach((key) => {
        response[key] = results[resultIndex];
        if (key === "recentTasks") {
          response.metadata.dataRange.recentTasksCount =
            results[resultIndex].length;
        } else if (key === "recentActivities") {
          response.metadata.dataRange.recentActivitiesCount =
            results[resultIndex].length;
        } else if (key === "projects") {
          response.metadata.dataRange.projectsCount =
            results[resultIndex].length;
        }
        resultIndex++;
      });

      // Apply project status filter if needed
      if (includeProjects && projectsStatus !== "all" && response.projects) {
        response.projects = response.projects.filter((project: any) => {
          if (projectsStatus === "active") {
            return project.progressPercentage < 100;
          } else if (projectsStatus === "completed") {
            return project.progressPercentage === 100;
          }
          return true;
        });
        response.metadata.dataRange.projectsCount = response.projects.length;
      }

      logger.info("Dashboard data retrieved successfully", {
        userId,
        userRole,
        statsDays,
        recentTasksCount: response.metadata.dataRange.recentTasksCount,
        recentActivitiesCount:
          response.metadata.dataRange.recentActivitiesCount,
        projectsCount: response.metadata.dataRange.projectsCount,
        includedSections: dataKeys,
      });

      return response as DashboardResponseDto;
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }
      logger.error("Get complete dashboard data error", error as Error);
      const appError: AppError = new Error(
        "Failed to get complete dashboard data"
      ) as AppError;
      appError.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appError.isOperational = true;
      throw appError;
    }
  }

  /**
   * Optimized user stats method that uses pre-fetched project data
   */
  private async getUserStatsOptimized(
    userId: string,
    startDate: Date
  ): Promise<DashboardStatsResponseDto> {
    try {
      // Get user project data once
      const userProjectData = await this.getUserProjectData(userId);

      const [totalTasks, completedTasks, inProgressTasks, overdueTasks] =
        await Promise.all([
          // User's assigned tasks
          Task.count({ where: { assigneeId: userId, deletedAt: null } as any }),
          Task.count({
            where: {
              assigneeId: userId,
              status: "done",
              deletedAt: null,
            } as any,
          }),
          Task.count({
            where: {
              assigneeId: userId,
              status: "in-progress",
              deletedAt: null,
            } as any,
          }),
          Task.count({
            where: {
              assigneeId: userId,
              dueDate: { [Op.lt]: new Date() },
              status: { [Op.ne]: "done" },
              deletedAt: null,
            } as any,
          }),
        ]);

      const stats = {
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        totalProjects: userProjectData.totalProjects,
        activeProjects: userProjectData.activeProjects,
        completedProjects: userProjectData.completedProjects,
        totalUsers: 0, // Not relevant for user stats
        activeUsers: 0, // Not relevant for user stats
      };

      logger.info("User statistics retrieved successfully", {
        userId,
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        totalProjects: userProjectData.totalProjects,
        activeProjects: userProjectData.activeProjects,
        completedProjects: userProjectData.completedProjects,
      });

      return stats;
    } catch (error) {
      logger.error("Get user stats optimized error", error as Error);
      const appError: AppError = new Error(
        "Failed to get user statistics"
      ) as AppError;
      appError.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appError.isOperational = true;
      throw appError;
    }
  }

  /**
   * Optimized method to get recent tasks for user
   */
  private async getRecentTasksOptimized(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<DashboardRecentTaskDto[]> {
    const tasks = await Task.findAll({
      where: { assigneeId: userId, deletedAt: null } as any,
      include: [
        { model: Project, as: "project" },
        { model: User, as: "assignee" },
      ],
      order: [["updatedAt", "DESC"]],
      limit,
      offset,
    });

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as "todo" | "in-progress" | "done",
      priority: task.priority as "low" | "medium" | "high",
      dueDate: task.dueDate
        ? typeof task.dueDate === "string"
          ? task.dueDate
          : task.dueDate.toISOString()
        : undefined,
      projectId: task.projectId,
      projectName: task.project?.name || "Unknown Project",
      assigneeId: task.assigneeId,
      assigneeName: task.assignee?.username,
      createdAt: task.createdAt.toISOString(),
    }));
  }

  /**
   * Optimized method to get recent activities for user
   */
  private async getRecentActivitiesOptimized(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<DashboardRecentActivityDto[]> {
    const activities = await Activity.findAll({
      where: { userId } as any,
      include: [
        { model: User, as: "user" },
        { model: Project, as: "project" },
        { model: Task, as: "task" },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return activities.map((activity) => ({
      id: activity.id,
      action: activity.action,
      description: activity.description || "",
      userId: activity.userId,
      userName: activity.user?.username || "Unknown User",
      projectId: activity.projectId,
      projectName: activity.project?.name,
      taskId: activity.taskId,
      taskTitle: activity.task?.title,
      createdAt: activity.createdAt.toISOString(),
    }));
  }

  /**
   * Optimized method to get projects for user
   */
  private async getProjectsOptimized(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<DashboardProjectDto[]> {
    // Get user project data to get project IDs
    const userProjectData = await this.getUserProjectData(userId);

    if (userProjectData.projectIds.length === 0) {
      return [];
    }

    const projects = await Project.findAll({
      where: {
        id: { [Op.in]: userProjectData.projectIds },
        deletedAt: null,
      } as any,
      include: [
        { model: User, as: "creator" },
        {
          model: Task,
          as: "tasks",
          required: false,
          where: { deletedAt: null } as any,
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit,
      offset,
    });

    return projects.map((project) => {
      const tasks = project.tasks || [];
      const completedTasks = tasks.filter(
        (task) => task.status === "done"
      ).length;
      const progressPercentage =
        tasks.length > 0
          ? Math.round((completedTasks / tasks.length) * 100)
          : 0;

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        taskCount: tasks.length,
        completedTaskCount: completedTasks,
        progressPercentage,
        createdBy: project.createdBy,
        creatorName: project.creator?.username || "Unknown User",
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      };
    });
  }
}

export default new DashboardService();
