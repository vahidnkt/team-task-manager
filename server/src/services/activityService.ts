import { ActivityModel } from "../models/Activity";
import {
  Activity,
  CreateActivityRequest,
  ActivitySummary,
} from "../types/activity.types";

export class ActivityService {
  // Get activities for a project
  async getProjectActivities(
    projectId: number,
    limit?: number,
    offset?: number
  ): Promise<Activity[]> {
    return await ActivityModel.findByProjectId(projectId, limit, offset);
  }

  // Get activities for a task
  async getTaskActivities(
    taskId: number,
    limit?: number,
    offset?: number
  ): Promise<Activity[]> {
    return await ActivityModel.findByTaskId(taskId, limit, offset);
  }

  // Get activities by user
  async getUserActivities(
    userId: number,
    limit?: number,
    offset?: number
  ): Promise<Activity[]> {
    return await ActivityModel.findByUserId(userId, limit, offset);
  }

  // Get recent activities across all projects (admin function)
  async getRecentActivities(
    limit: number = 50,
    offset: number = 0
  ): Promise<Activity[]> {
    return await ActivityModel.findRecent(limit, offset);
  }

  // Get project activity statistics
  async getProjectActivityStats(
    projectId: number,
    days: number = 30
  ): Promise<ActivitySummary> {
    return await ActivityModel.getProjectActivityStats(projectId, days);
  }

  // Get user activity summary
  async getUserActivitySummary(userId: number, days: number = 7): Promise<any> {
    return await ActivityModel.getUserActivitySummary(userId, days);
  }

  // Create generic activity log
  async logActivity(activityData: CreateActivityRequest): Promise<Activity> {
    return await ActivityModel.create(activityData);
  }

  // Project-related activity logging methods
  async logProjectCreated(
    projectId: number,
    userId: number,
    projectName: string
  ): Promise<Activity> {
    return await ActivityModel.logProjectCreated(
      projectId,
      userId,
      projectName
    );
  }

  async logProjectUpdated(
    projectId: number,
    userId: number,
    projectName: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: undefined,
      user_id: userId,
      action: "project_updated",
      description: `Project '${projectName}' was updated`,
    });
  }

  async logProjectDeleted(
    projectId: number,
    userId: number,
    projectName: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: undefined,
      user_id: userId,
      action: "project_deleted",
      description: `Project '${projectName}' was deleted`,
    });
  }

  async logProjectArchived(
    projectId: number,
    userId: number,
    projectName: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: undefined,
      user_id: userId,
      action: "project_archived",
      description: `Project '${projectName}' was archived`,
    });
  }

  async logProjectDuplicated(
    newProjectId: number,
    userId: number,
    newProjectName: string,
    originalProjectName: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: newProjectId,
      task_id: undefined,
      user_id: userId,
      action: "project_duplicated",
      description: `Project '${newProjectName}' was created as a copy of '${originalProjectName}'`,
    });
  }

  // Task-related activity logging methods
  async logTaskCreated(
    projectId: number,
    taskId: number,
    userId: number,
    taskTitle: string
  ): Promise<Activity> {
    return await ActivityModel.logTaskCreated(
      projectId,
      taskId,
      userId,
      taskTitle
    );
  }

  async logTaskAssigned(
    projectId: number,
    taskId: number,
    userId: number,
    assigneeUsername: string
  ): Promise<Activity> {
    return await ActivityModel.logTaskAssigned(
      projectId,
      taskId,
      userId,
      assigneeUsername
    );
  }

  async logTaskUnassigned(
    projectId: number,
    taskId: number,
    userId: number
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "task_unassigned",
      description: "Task was unassigned",
    });
  }

  async logStatusChanged(
    projectId: number,
    taskId: number,
    userId: number,
    oldStatus: string,
    newStatus: string
  ): Promise<Activity> {
    return await ActivityModel.logStatusChanged(
      projectId,
      taskId,
      userId,
      oldStatus,
      newStatus
    );
  }

  async logTaskUpdated(
    projectId: number,
    taskId: number,
    userId: number,
    taskTitle: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "task_updated",
      description: `Task '${taskTitle}' was updated`,
    });
  }

  async logTaskDeleted(
    projectId: number,
    taskId: number,
    userId: number,
    taskTitle: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "task_deleted",
      description: `Task '${taskTitle}' was deleted`,
    });
  }

  async logTaskMoved(
    oldProjectId: number,
    newProjectId: number,
    taskId: number,
    userId: number,
    taskTitle: string
  ): Promise<void> {
    // Log in both projects
    await Promise.all([
      this.logActivity({
        project_id: oldProjectId,
        task_id: taskId,
        user_id: userId,
        action: "task_moved",
        description: `Task '${taskTitle}' was moved to another project`,
      }),
      this.logActivity({
        project_id: newProjectId,
        task_id: taskId,
        user_id: userId,
        action: "task_moved",
        description: `Task '${taskTitle}' was moved from another project`,
      }),
    ]);
  }

  async logTaskDuplicated(
    projectId: number,
    originalTaskId: number,
    newTaskId: number,
    userId: number,
    newTaskTitle: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: newTaskId,
      user_id: userId,
      action: "task_duplicated",
      description: `Task '${newTaskTitle}' was created as a copy`,
    });
  }

  // Comment-related activity logging methods
  async logCommentAdded(
    projectId: number,
    taskId: number,
    userId: number
  ): Promise<Activity> {
    return await ActivityModel.logCommentAdded(projectId, taskId, userId);
  }

  async logCommentUpdated(
    projectId: number,
    taskId: number,
    userId: number
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "comment_updated",
      description: "Comment was updated",
    });
  }

  async logCommentDeleted(
    projectId: number,
    taskId: number,
    userId: number
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "comment_deleted",
      description: "Comment was deleted",
    });
  }

  // User-related activity logging methods
  async logUserJoinedProject(
    projectId: number,
    userId: number,
    newUserId: number,
    newUsername: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: undefined,
      user_id: userId,
      action: "user_joined",
      description: `User '${newUsername}' joined the project`,
    });
  }

  async logUserLeftProject(
    projectId: number,
    userId: number,
    leftUserId: number,
    leftUsername: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: undefined,
      user_id: userId,
      action: "user_left",
      description: `User '${leftUsername}' left the project`,
    });
  }

  // File/attachment related (for future enhancement)
  async logFileAttached(
    projectId: number,
    taskId: number,
    userId: number,
    fileName: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "file_attached",
      description: `File '${fileName}' was attached`,
    });
  }

  async logFileRemoved(
    projectId: number,
    taskId: number,
    userId: number,
    fileName: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "file_removed",
      description: `File '${fileName}' was removed`,
    });
  }

  // Due date related activities
  async logDueDateSet(
    projectId: number,
    taskId: number,
    userId: number,
    dueDate: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "due_date_set",
      description: `Due date set to ${dueDate}`,
    });
  }

  async logDueDateChanged(
    projectId: number,
    taskId: number,
    userId: number,
    oldDate: string,
    newDate: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "due_date_changed",
      description: `Due date changed from ${oldDate} to ${newDate}`,
    });
  }

  async logDueDateRemoved(
    projectId: number,
    taskId: number,
    userId: number
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "due_date_removed",
      description: "Due date was removed",
    });
  }

  // Priority related activities
  async logPriorityChanged(
    projectId: number,
    taskId: number,
    userId: number,
    oldPriority: string,
    newPriority: string
  ): Promise<Activity> {
    return await this.logActivity({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "priority_changed",
      description: `Priority changed from '${oldPriority}' to '${newPriority}'`,
    });
  }

  // Utility methods
  async getActivityById(activityId: number): Promise<Activity | null> {
    return await ActivityModel.findById(activityId);
  }

  // Clean up old activities (admin function)
  async cleanupOldActivities(days: number = 365): Promise<number> {
    return await ActivityModel.deleteOldActivities(days);
  }

  // Get activity statistics for admin dashboard
  async getSystemActivityStats(days: number = 30): Promise<any> {
    const activities = await this.getRecentActivities(1000, 0); // Get more activities for stats

    // Process activities into statistics
    const stats = {
      total_activities: activities.length,
      period_days: days,
      actions_summary: {} as Record<string, number>,
      daily_activities: {} as Record<string, number>,
      most_active_users: [] as Array<{
        username: string;
        activity_count: number;
      }>,
    };

    // Calculate action summaries and daily activities
    const userActivityCount = {} as Record<string, number>;

    activities.forEach((activity) => {
      // Count by action
      if (activity.action && !stats.actions_summary[activity.action]) {
        stats.actions_summary[activity.action] = 0;
      }
      if (activity.action) {
        stats.actions_summary[activity.action] =
          (stats.actions_summary[activity.action] || 0) + 1;
      }

      // Count by date
      if (activity.created_at) {
        const date = new Date(activity.created_at).toISOString().split("T")[0];
        if (date) {
          stats.daily_activities[date] =
            (stats.daily_activities[date] || 0) + 1;
        }
      }

      // Count by user
      if (activity.username) {
        userActivityCount[activity.username] =
          (userActivityCount[activity.username] || 0) + 1;
      }
    });

    // Get most active users
    stats.most_active_users = Object.entries(userActivityCount)
      .map(([username, count]) => ({ username, activity_count: count }))
      .sort((a, b) => b.activity_count - a.activity_count)
      .slice(0, 10);

    return stats;
  }
}

export const activityService = new ActivityService();
