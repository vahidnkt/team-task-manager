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
   * Get dashboard statistics based on user role
   */
  public async getDashboardStats(
    userId: string,
    userRole: string,
    days: number = 30
  ): Promise<DashboardStatsResponseDto> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      if (userRole === "admin") {
        // Admin gets system-wide statistics
        return await this.getAdminStats(startDate);
      } else {
        // User gets personal statistics
        return await this.getUserStats(userId, startDate);
      }
    } catch (error) {
      logger.error("Get dashboard stats error", error as Error);
      throw new Error("Failed to get dashboard statistics");
    }
  }

  // Get admin statistics (system-wide)
  private async getAdminStats(
    startDate: Date
  ): Promise<DashboardStatsResponseDto> {
    const [
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      totalProjects,
      activeProjects,
      completedProjects,
      totalUsers,
      activeUsers,
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
      Project.count({
        where: {
          deletedAt: null,
          "$tasks.status$": { [Op.ne]: "done" },
        } as any,
        include: [{ model: Task, as: "tasks", required: false }],
      }),
      Project.count({
        where: {
          deletedAt: null,
          "$tasks.status$": "done",
        } as any,
        include: [{ model: Task, as: "tasks", required: true }],
      }),
      // User statistics
      User.count({ where: { deletedAt: null } as any }),
      User.count({
        where: {
          deletedAt: null,
          "$activities.createdAt$": { [Op.gte]: startDate },
        } as any,
        include: [{ model: Activity, as: "activities", required: false }],
      }),
    ]);

    return {
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
  }

  // Get user statistics (personal)
  private async getUserStats(
    userId: string,
    startDate: Date
  ): Promise<DashboardStatsResponseDto> {
    // Get user project data once to avoid duplicate queries
    const userProjectData = await this.getUserProjectData(userId);

    const [totalTasks, completedTasks, inProgressTasks, overdueTasks] =
      await Promise.all([
        // User's assigned tasks
        Task.count({ where: { assigneeId: userId, deletedAt: null } as any }),
        Task.count({
          where: { assigneeId: userId, status: "done", deletedAt: null } as any,
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

    // Calculate project counts from cached data
    const totalProjects = userProjectData.totalProjects;
    const activeProjects = userProjectData.activeProjects;
    const completedProjects = userProjectData.completedProjects;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      totalProjects,
      activeProjects,
      completedProjects,
    };
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

      return {
        totalProjects: uniqueProjectIds.length,
        activeProjects,
        completedProjects,
        projectIds: uniqueProjectIds,
      };
    } catch (error) {
      logger.error("Error getting user project data:", error as Error);
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        projectIds: [],
      };
    }
  }

  /**
   * Helper method to count user projects with different statuses
   */
  private async getUserProjectCount(
    userId: string,
    status: "active" | "completed" | null
  ): Promise<number> {
    const data = await this.getUserProjectData(userId);

    switch (status) {
      case "active":
        return data.activeProjects;
      case "completed":
        return data.completedProjects;
      default:
        return data.totalProjects;
    }
  }

  /**
   * Get recent tasks based on user role
   */
  public async getRecentTasks(
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
      dueDate: task.dueDate?.toISOString().split("T")[0],
      projectId: task.projectId,
      projectName: task.project?.name || "Unknown Project",
      assigneeId: task.assigneeId,
      assigneeName: task.assignee?.username,
      createdAt: task.createdAt.toISOString(),
    }));
  }

  /**
   * Get recent activities based on user role
   */
  public async getRecentActivities(
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
   * Get projects based on user role (optimized version)
   */
  public async getProjects(
    userId: string,
    userRole: string,
    limit: number = 20,
    offset: number = 0,
    preFetchedProjectIds?: string[]
  ): Promise<DashboardProjectDto[]> {
    let projectIds: string[] = [];

    if (preFetchedProjectIds) {
      // Use pre-fetched project IDs to avoid duplicate queries
      projectIds = preFetchedProjectIds;
    } else if (userRole === "admin") {
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
   * Get complete dashboard data (optimized to prevent duplicate queries)
   */
  public async getDashboardData(
    userId: string,
    userRole: string,
    options: {
      statsDays?: number;
      recentLimit?: number;
      recentOffset?: number;
      projectsLimit?: number;
      projectsOffset?: number;
    } = {}
  ): Promise<DashboardResponseDto> {
    const {
      statsDays = 30,
      recentLimit = 10,
      recentOffset = 0,
      projectsLimit = 20,
      projectsOffset = 0,
    } = options;

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - statsDays);

      if (userRole === "admin") {
        // Admin gets system-wide data
        const [stats, recentTasks, recentActivities, projects] =
          await Promise.all([
            this.getAdminStats(startDate),
            this.getRecentTasks(userId, userRole, recentLimit, recentOffset),
            this.getRecentActivities(
              userId,
              userRole,
              recentLimit,
              recentOffset
            ),
            this.getProjects(userId, userRole, projectsLimit, projectsOffset),
          ]);

        return {
          stats,
          recentTasks,
          recentActivities,
          projects,
        };
      } else {
        // User gets personal data - fetch everything in one optimized call
        const [stats, recentTasks, recentActivities, projects] =
          await Promise.all([
            this.getUserStatsOptimized(userId, startDate),
            this.getRecentTasksOptimized(userId, recentLimit, recentOffset),
            this.getRecentActivitiesOptimized(
              userId,
              recentLimit,
              recentOffset
            ),
            this.getProjectsOptimized(userId, projectsLimit, projectsOffset),
          ]);

        return {
          stats,
          recentTasks,
          recentActivities,
          projects,
        };
      }
    } catch (error) {
      logger.error("Get dashboard data error", error as Error);
      throw new Error("Failed to get dashboard data");
    }
  }

  /**
   * Optimized user stats method that uses pre-fetched project data
   */
  private async getUserStatsOptimized(
    userId: string,
    startDate: Date
  ): Promise<DashboardStatsResponseDto> {
    // Get user project data once
    const userProjectData = await this.getUserProjectData(userId);

    const [totalTasks, completedTasks, inProgressTasks, overdueTasks] =
      await Promise.all([
        // User's assigned tasks
        Task.count({ where: { assigneeId: userId, deletedAt: null } as any }),
        Task.count({
          where: { assigneeId: userId, status: "done", deletedAt: null } as any,
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

    return {
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
      dueDate: task.dueDate?.toISOString(),
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
