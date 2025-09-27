import { Activity } from "../models/Activity";
import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { User } from "../models/User";
import {
  CreateActivityRequest,
  ActivitySummary,
} from "../types/activity.types";
import { HTTP_STATUS } from "../utils/constants";

export class ActivityService {
  // Create a new activity log entry
  async createActivity(activityData: CreateActivityRequest): Promise<Activity> {
    const { project_id, task_id, user_id, action, description } = activityData;

    // Verify project exists
    const project = await Project.findByPk(project_id);
    if (!project) {
      throw new Error("Project not found");
    }

    // Verify user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify task exists if task_id is provided
    if (task_id) {
      const task = await Task.findByPk(task_id);
      if (!task) {
        throw new Error("Task not found");
      }
    }

    // Create activity using Sequelize
    return await Activity.create({
      projectId: project_id,
      taskId: task_id || undefined,
      userId: user_id,
      action,
      description,
    } as any);
  }

  // Find activity by ID
  async getActivityById(id: string): Promise<Activity | null> {
    return await Activity.findByPk(id, {
      include: [
        { model: User, as: "user" },
        { model: Project, as: "project" },
        { model: Task, as: "task" },
      ],
    });
  }

  // Get activities for a specific project
  async getProjectActivities(
    projectId: string,
    limit?: number,
    offset?: number
  ): Promise<Activity[]> {
    const options: any = {
      where: { projectId },
      include: [
        { model: User, as: "user" },
        { model: Project, as: "project" },
        { model: Task, as: "task" },
      ],
      order: [["createdAt", "DESC"]],
    };

    if (limit !== undefined) {
      options.limit = limit;
      if (offset !== undefined) {
        options.offset = offset;
      }
    }

    return await Activity.findAll(options);
  }

  // Get activities for a specific task
  async getTaskActivities(
    taskId: string,
    limit?: number,
    offset?: number
  ): Promise<Activity[]> {
    const options: any = {
      where: { taskId },
      include: [
        { model: User, as: "user" },
        { model: Project, as: "project" },
        { model: Task, as: "task" },
      ],
      order: [["createdAt", "DESC"]],
    };

    if (limit !== undefined) {
      options.limit = limit;
      if (offset !== undefined) {
        options.offset = offset;
      }
    }

    return await Activity.findAll(options);
  }

  // Get activities by user
  async getUserActivities(
    userId: string,
    limit?: number,
    offset?: number
  ): Promise<Activity[]> {
    const options: any = {
      where: { userId },
      include: [
        { model: User, as: "user" },
        { model: Project, as: "project" },
        { model: Task, as: "task" },
      ],
      order: [["createdAt", "DESC"]],
    };

    if (limit !== undefined) {
      options.limit = limit;
      if (offset !== undefined) {
        options.offset = offset;
      }
    }

    return await Activity.findAll(options);
  }

  // Get recent activities across all projects (admin function)
  async getRecentActivities(
    limit: number = 50,
    offset: number = 0
  ): Promise<Activity[]> {
    return await Activity.findAll({
      include: [
        { model: User, as: "user" },
        { model: Project, as: "project" },
        { model: Task, as: "task" },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
  }

  // Get activity summary for a project over a time period
  async getProjectActivityStats(
    projectId: string,
    days: number = 30
  ): Promise<ActivitySummary> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await Activity.findAll({
      where: {
        projectId,
        createdAt: {
          [require("sequelize").Op.gte]: startDate,
        },
      },
      include: [{ model: User, as: "user" }],
      order: [["createdAt", "DESC"]],
    });

    const summary: ActivitySummary = {
      project_id: projectId,
      period_days: days,
      total_activities: activities.length,
      actions_summary: {},
      daily_activities: {},
      most_active_users: [],
    };

    // Process activities
    const userActivityCount: Record<string, number> = {};

    activities.forEach((activity) => {
      // Count actions
      if (activity.action) {
        const action = activity.action;
        summary.actions_summary[action] =
          (summary.actions_summary[action] || 0) + 1;
      }

      // Count daily activities
      if (activity.createdAt) {
        const date = activity.createdAt.toISOString().split("T")[0];
        if (date) {
          summary.daily_activities[date] =
            (summary.daily_activities[date] || 0) + 1;
        }
      }

      // Count user activities
      if (activity.user?.username) {
        userActivityCount[activity.user.username] =
          (userActivityCount[activity.user.username] || 0) + 1;
      }
    });

    // Get most active users
    summary.most_active_users = Object.entries(userActivityCount)
      .map(([username, activity_count]) => ({ username, activity_count }))
      .sort((a, b) => b.activity_count - a.activity_count)
      .slice(0, 10);

    return summary;
  }

  // Get user activity summary
  async getUserActivitySummary(userId: string, days: number = 7): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await Activity.findAll({
      where: {
        userId,
        createdAt: {
          [require("sequelize").Op.gte]: startDate,
        },
      },
      include: [
        { model: Project, as: "project" },
        { model: Task, as: "task" },
      ],
      order: [["createdAt", "DESC"]],
    });

    const summary = {
      user_id: userId,
      period_days: days,
      total_activities: activities.length,
      actions_summary: {} as Record<string, number>,
      daily_activities: {} as Record<string, number>,
    };

    activities.forEach((activity) => {
      // Count actions
      if (activity.action) {
        const action = activity.action;
        summary.actions_summary[action] =
          (summary.actions_summary[action] || 0) + 1;
      }

      // Count daily activities
      if (activity.createdAt) {
        const date = activity.createdAt.toISOString().split("T")[0];
        if (date) {
          summary.daily_activities[date] =
            (summary.daily_activities[date] || 0) + 1;
        }
      }
    });

    return summary;
  }

  // Log common activity types with helper methods
  async logTaskCreated(
    projectId: string,
    taskId: string,
    userId: string,
    taskTitle: string
  ): Promise<Activity> {
    return await this.createActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "task_created",
      description: `Task '${taskTitle}' was created`,
    });
  }

  async logTaskAssigned(
    projectId: string,
    taskId: string,
    userId: string,
    assigneeUsername: string
  ): Promise<Activity> {
    return await this.createActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "task_assigned",
      description: `Task assigned to ${assigneeUsername}`,
    });
  }

  async logStatusChanged(
    projectId: string,
    taskId: string,
    userId: string,
    oldStatus: string,
    newStatus: string
  ): Promise<Activity> {
    return await this.createActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "status_changed",
      description: `Task status changed from '${oldStatus}' to '${newStatus}'`,
    });
  }

  async logCommentAdded(
    projectId: string,
    taskId: string,
    userId: string
  ): Promise<Activity> {
    return await this.createActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "comment_added",
      description: "Comment added to task",
    });
  }

  async logProjectCreated(
    projectId: string,
    userId: string,
    projectName: string
  ): Promise<Activity> {
    return await this.createActivity({
      project_id: projectId,
      task_id: undefined,
      user_id: userId,
      action: "project_created",
      description: `Project '${projectName}' was created`,
    });
  }

  async logProjectUpdated(
    projectId: string,
    userId: string,
    projectName: string
  ): Promise<Activity> {
    return await this.createActivity({
      project_id: projectId,
      task_id: undefined,
      user_id: userId,
      action: "project_updated",
      description: `Project '${projectName}' was updated`,
    });
  }

  async logProjectDeleted(
    projectId: string,
    userId: string,
    projectName: string
  ): Promise<Activity> {
    return await this.createActivity({
      project_id: projectId,
      task_id: undefined,
      user_id: userId,
      action: "project_deleted",
      description: `Project '${projectName}' was deleted`,
    });
  }

  // Delete old activities (admin function, for cleanup)
  async deleteOldActivities(days: number = 365): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await Activity.destroy({
      where: {
        createdAt: {
          [require("sequelize").Op.lt]: cutoffDate,
        },
      },
    });

    return result;
  }

  // Get system-wide activity statistics (admin function)
  async getSystemActivityStats(days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await Activity.findAll({
      where: {
        createdAt: {
          [require("sequelize").Op.gte]: startDate,
        },
      },
      include: [
        { model: User, as: "user" },
        { model: Project, as: "project" },
      ],
      order: [["createdAt", "DESC"]],
    });

    const stats = {
      period_days: days,
      total_activities: activities.length,
      actions_summary: {} as Record<string, number>,
      daily_activities: {} as Record<string, number>,
      most_active_users: [] as Array<{
        username: string;
        activity_count: number;
      }>,
      most_active_projects: [] as Array<{
        project_name: string;
        activity_count: number;
      }>,
    };

    const userActivityCount: Record<string, number> = {};
    const projectActivityCount: Record<string, number> = {};

    activities.forEach((activity) => {
      // Count actions
      if (activity.action) {
        const action = activity.action;
        stats.actions_summary[action] =
          (stats.actions_summary[action] || 0) + 1;
      }

      // Count daily activities
      if (activity.createdAt) {
        const date = activity.createdAt.toISOString().split("T")[0];
        if (date) {
          stats.daily_activities[date] =
            (stats.daily_activities[date] || 0) + 1;
        }
      }

      // Count user activities
      if (activity.user?.username) {
        userActivityCount[activity.user.username] =
          (userActivityCount[activity.user.username] || 0) + 1;
      }

      // Count project activities
      if (activity.project?.name) {
        projectActivityCount[activity.project.name] =
          (projectActivityCount[activity.project.name] || 0) + 1;
      }
    });

    // Get most active users
    stats.most_active_users = Object.entries(userActivityCount)
      .map(([username, activity_count]) => ({ username, activity_count }))
      .sort((a, b) => b.activity_count - a.activity_count)
      .slice(0, 10);

    // Get most active projects
    stats.most_active_projects = Object.entries(projectActivityCount)
      .map(([project_name, activity_count]) => ({
        project_name,
        activity_count,
      }))
      .sort((a, b) => b.activity_count - a.activity_count)
      .slice(0, 10);

    return stats;
  }

  // Delete activity (admin only)
  async deleteActivity(id: string): Promise<boolean> {
    const activity = await Activity.findByPk(id);
    if (!activity) {
      return false;
    }

    await Activity.destroy({ where: { id } });
    return true;
  }

  // Update activity (admin only)
  async updateActivity(
    id: string,
    updateData: { action?: string; description?: string }
  ): Promise<Activity | null> {
    const activity = await Activity.findByPk(id);
    if (!activity) {
      return null;
    }

    await Activity.update(updateData, { where: { id } });
    return await Activity.findByPk(id, {
      include: [
        { model: User, as: "user" },
        { model: Project, as: "project" },
        { model: Task, as: "task" },
      ],
    });
  }
}

export const activityService = new ActivityService();
