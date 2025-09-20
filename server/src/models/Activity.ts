import database from "../config/database";
import {
  Activity,
  CreateActivityRequest,
  ActivitySummary,
} from "../types/activity.types";

export class ActivityModel {
  // Create a new activity log entry
  public static async create(
    activityData: CreateActivityRequest
  ): Promise<Activity> {
    const { project_id, task_id, user_id, action, description } = activityData;

    const result = await database.execute(
      `INSERT INTO activities (project_id, task_id, user_id, action, description, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [project_id, task_id || null, user_id, action, description]
    );

    const newActivity = await this.findById(result.insertId);
    if (!newActivity) {
      throw new Error("Failed to create activity");
    }

    return newActivity;
  }

  // Find activity by ID
  public static async findById(id: number): Promise<Activity | null> {
    const rows = await database.query(
      `SELECT a.*, u.username, p.name as project_name, t.title as task_title
       FROM activities a
       JOIN users u ON a.user_id = u.id
       JOIN projects p ON a.project_id = p.id
       LEFT JOIN tasks t ON a.task_id = t.id
       WHERE a.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return this.mapRowToActivity(rows[0]);
  }

  // Get activities for a specific project
  public static async findByProjectId(
    projectId: number,
    limit?: number,
    offset?: number
  ): Promise<Activity[]> {
    let query = `
      SELECT a.*, u.username, p.name as project_name, t.title as task_title
      FROM activities a
      JOIN users u ON a.user_id = u.id
      JOIN projects p ON a.project_id = p.id
      LEFT JOIN tasks t ON a.task_id = t.id
      WHERE a.project_id = ?
      ORDER BY a.created_at DESC
    `;

    const params: any[] = [projectId];

    if (limit !== undefined) {
      query += " LIMIT ?";
      params.push(limit);

      if (offset !== undefined) {
        query += " OFFSET ?";
        params.push(offset);
      }
    }

    const rows = await database.query(query, params);

    return rows.map((row) => this.mapRowToActivity(row));
  }

  // Get activities for a specific task
  public static async findByTaskId(
    taskId: number,
    limit?: number,
    offset?: number
  ): Promise<Activity[]> {
    let query = `
      SELECT a.*, u.username, p.name as project_name, t.title as task_title
      FROM activities a
      JOIN users u ON a.user_id = u.id
      JOIN projects p ON a.project_id = p.id
      LEFT JOIN tasks t ON a.task_id = t.id
      WHERE a.task_id = ?
      ORDER BY a.created_at DESC
    `;

    const params: any[] = [taskId];

    if (limit !== undefined) {
      query += " LIMIT ?";
      params.push(limit);

      if (offset !== undefined) {
        query += " OFFSET ?";
        params.push(offset);
      }
    }

    const rows = await database.query(query, params);

    return rows.map((row) => this.mapRowToActivity(row));
  }

  // Get activities by user
  public static async findByUserId(
    userId: number,
    limit?: number,
    offset?: number
  ): Promise<Activity[]> {
    let query = `
      SELECT a.*, u.username, p.name as project_name, t.title as task_title
      FROM activities a
      JOIN users u ON a.user_id = u.id
      JOIN projects p ON a.project_id = p.id
      LEFT JOIN tasks t ON a.task_id = t.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `;

    const params: any[] = [userId];

    if (limit !== undefined) {
      query += " LIMIT ?";
      params.push(limit);

      if (offset !== undefined) {
        query += " OFFSET ?";
        params.push(offset);
      }
    }

    const rows = await database.query(query, params);

    return rows.map((row) => this.mapRowToActivity(row));
  }

  // Get recent activities across all projects (admin function)
  public static async findRecent(
    limit: number = 50,
    offset: number = 0
  ): Promise<Activity[]> {
    const rows = await database.query(
      `SELECT a.*, u.username, p.name as project_name, t.title as task_title
       FROM activities a
       JOIN users u ON a.user_id = u.id
       JOIN projects p ON a.project_id = p.id
       LEFT JOIN tasks t ON a.task_id = t.id
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return rows.map((row) => this.mapRowToActivity(row));
  }

  // Get activity summary for a project over a time period
  public static async getProjectActivityStats(
    projectId: number,
    days: number = 30
  ): Promise<ActivitySummary> {
    const rows = await database.query(
      `SELECT
         action,
         COUNT(*) as count,
         DATE(created_at) as activity_date
       FROM activities
       WHERE project_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY action, DATE(created_at)
       ORDER BY activity_date DESC, count DESC`,
      [projectId, days]
    );

    // Process the results into a summary format
    const summary: ActivitySummary = {
      project_id: projectId,
      period_days: days,
      total_activities: 0,
      actions_summary: {},
      daily_activities: {},
      most_active_users: [],
    };

    // Calculate totals and action summaries
    rows.forEach((row) => {
      summary.total_activities += row.count;

      if (!summary.actions_summary[row.action]) {
        summary.actions_summary[row.action] = 0;
      }
      summary.actions_summary[row.action] += row.count;

      if (!summary.daily_activities[row.activity_date]) {
        summary.daily_activities[row.activity_date] = 0;
      }
      summary.daily_activities[row.activity_date] += row.count;
    });

    // Get most active users for this project
    const userRows = await database.query(
      `SELECT u.username, COUNT(*) as activity_count
       FROM activities a
       JOIN users u ON a.user_id = u.id
       WHERE a.project_id = ? AND a.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY a.user_id, u.username
       ORDER BY activity_count DESC
       LIMIT 10`,
      [projectId, days]
    );

    summary.most_active_users = userRows.map((row) => ({
      username: row.username,
      activity_count: row.activity_count,
    }));

    return summary;
  }

  // Get user activity summary
  public static async getUserActivitySummary(
    userId: number,
    days: number = 7
  ): Promise<any> {
    const rows = await database.query(
      `SELECT
         action,
         COUNT(*) as count,
         DATE(created_at) as activity_date
       FROM activities
       WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY action, DATE(created_at)
       ORDER BY activity_date DESC`,
      [userId, days]
    );

    const summary = {
      user_id: userId,
      period_days: days,
      total_activities: 0,
      actions_summary: {} as Record<string, number>,
      daily_activities: {} as Record<string, number>,
    };

    rows.forEach((row) => {
      summary.total_activities += row.count;

      if (!summary.actions_summary[row.action]) {
        summary.actions_summary[row.action] = 0;
      }
      summary.actions_summary[row.action] += row.count;

      if (!summary.daily_activities[row.activity_date]) {
        summary.daily_activities[row.activity_date] = 0;
      }
      summary.daily_activities[row.activity_date] += row.count;
    });

    return summary;
  }

  // Log common activity types with helper methods
  public static async logTaskCreated(
    projectId: number,
    taskId: number,
    userId: number,
    taskTitle: string
  ): Promise<Activity> {
    return await this.create({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "task_created",
      description: `Task '${taskTitle}' was created`,
    });
  }

  public static async logTaskAssigned(
    projectId: number,
    taskId: number,
    userId: number,
    assigneeUsername: string
  ): Promise<Activity> {
    return await this.create({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "task_assigned",
      description: `Task assigned to ${assigneeUsername}`,
    });
  }

  public static async logStatusChanged(
    projectId: number,
    taskId: number,
    userId: number,
    oldStatus: string,
    newStatus: string
  ): Promise<Activity> {
    return await this.create({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "status_changed",
      description: `Task status changed from '${oldStatus}' to '${newStatus}'`,
    });
  }

  public static async logCommentAdded(
    projectId: number,
    taskId: number,
    userId: number
  ): Promise<Activity> {
    return await this.create({
      project_id: projectId,
      task_id: taskId,
      user_id: userId,
      action: "comment_added",
      description: "Comment added to task",
    });
  }

  public static async logProjectCreated(
    projectId: number,
    userId: number,
    projectName: string
  ): Promise<Activity> {
    return await this.create({
      project_id: projectId,
      task_id: undefined,
      user_id: userId,
      action: "project_created",
      description: `Project '${projectName}' was created`,
    });
  }

  // Delete activities (admin function, for cleanup)
  public static async deleteOldActivities(days: number = 365): Promise<number> {
    const result = await database.execute(
      "DELETE FROM activities WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)",
      [days]
    );

    return result.affectedRows;
  }

  // Private method to map database row to Activity object
  private static mapRowToActivity(row: any): Activity {
    return {
      id: row.id,
      project_id: row.project_id,
      task_id: row.task_id,
      user_id: row.user_id,
      action: row.action,
      description: row.description,
      created_at: row.created_at,
      username: row.username,
      project_name: row.project_name,
      task_title: row.task_title,
    };
  }
}
