import database from "../config/database";
import { Task, CreateTaskRequest, UpdateTaskRequest } from "../types";

export class TaskModel {
  /**
   * Create a new task
   */
  public static async create(
    taskData: CreateTaskRequest,
    projectId: number
  ): Promise<Task> {
    const query = `
      INSERT INTO tasks (project_id, title, description, assignee_id, status, priority, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await database.execute(query, [
      projectId,
      taskData.title,
      taskData.description || null,
      taskData.assignee_id || null,
      "todo",
      taskData.priority || "medium",
      taskData.due_date || null,
    ]);

    const newTask = await this.findById(result.insertId);
    if (!newTask) {
      throw new Error("Failed to create task");
    }

    return newTask;
  }

  /**
   * Find task by ID
   */
  public static async findById(id: number): Promise<Task | null> {
    const query = `
      SELECT id, project_id, title, description, assignee_id, status, priority, due_date, created_at, updated_at, deleted_at
      FROM tasks 
      WHERE id = ? AND deleted_at IS NULL
    `;

    return await database.queryOne<Task>(query, [id]);
  }

  /**
   * Get all tasks in a project
   */
  public static async findByProject(
    projectId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<Task[]> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, project_id, title, description, assignee_id, status, priority, due_date, created_at, updated_at, deleted_at
      FROM tasks 
      WHERE project_id = ? AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    return await database.query<Task>(query, [projectId, limit, offset]);
  }

  /**
   * Get tasks assigned to a user
   */
  public static async findByAssignee(
    assigneeId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<Task[]> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, project_id, title, description, assignee_id, status, priority, due_date, created_at, updated_at, deleted_at
      FROM tasks 
      WHERE assignee_id = ? AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    return await database.query<Task>(query, [assigneeId, limit, offset]);
  }

  /**
   * Get tasks by status
   */
  public static async findByStatus(
    status: string,
    projectId?: number
  ): Promise<Task[]> {
    let query = `
      SELECT id, project_id, title, description, assignee_id, status, priority, due_date, created_at, updated_at, deleted_at
      FROM tasks 
      WHERE status = ? AND deleted_at IS NULL
    `;
    const params: any[] = [status];

    if (projectId) {
      query += " AND project_id = ?";
      params.push(projectId);
    }

    query += " ORDER BY created_at DESC";

    return await database.query<Task>(query, params);
  }

  /**
   * Update task
   */
  public static async update(
    id: number,
    taskData: UpdateTaskRequest
  ): Promise<Task | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (taskData.title) {
      fields.push("title = ?");
      values.push(taskData.title);
    }
    if (taskData.description !== undefined) {
      fields.push("description = ?");
      values.push(taskData.description);
    }
    if (taskData.assignee_id !== undefined) {
      fields.push("assignee_id = ?");
      values.push(taskData.assignee_id);
    }
    if (taskData.status) {
      fields.push("status = ?");
      values.push(taskData.status);
    }
    if (taskData.priority) {
      fields.push("priority = ?");
      values.push(taskData.priority);
    }
    if (taskData.due_date !== undefined) {
      fields.push("due_date = ?");
      values.push(taskData.due_date);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE tasks 
      SET ${fields.join(", ")}
      WHERE id = ? AND deleted_at IS NULL
    `;

    await database.execute(query, values);
    return await this.findById(id);
  }

  /**
   * Update task status
   */
  public static async updateStatus(
    id: number,
    status: string
  ): Promise<Task | null> {
    const query = `
      UPDATE tasks 
      SET status = ?
      WHERE id = ? AND deleted_at IS NULL
    `;

    await database.execute(query, [status, id]);
    return await this.findById(id);
  }

  /**
   * Assign task to user
   */
  public static async assign(
    id: number,
    assigneeId: number | null
  ): Promise<Task | null> {
    const query = `
      UPDATE tasks 
      SET assignee_id = ?
      WHERE id = ? AND deleted_at IS NULL
    `;

    await database.execute(query, [assigneeId, id]);
    return await this.findById(id);
  }

  /**
   * Soft delete task
   */
  public static async delete(id: number): Promise<boolean> {
    const query = `
      UPDATE tasks 
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL
    `;

    const result = await database.execute(query, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Count tasks in project
   */
  public static async countByProject(projectId: number): Promise<number> {
    const query = `
      SELECT COUNT(*) as total
      FROM tasks 
      WHERE project_id = ? AND deleted_at IS NULL
    `;

    const result = await database.queryOne<{ total: number }>(query, [
      projectId,
    ]);
    return result?.total || 0;
  }

  /**
   * Count tasks by status
   */
  public static async countByStatus(
    status: string,
    projectId?: number
  ): Promise<number> {
    let query = `
      SELECT COUNT(*) as total
      FROM tasks 
      WHERE status = ? AND deleted_at IS NULL
    `;
    const params: any[] = [status];

    if (projectId) {
      query += " AND project_id = ?";
      params.push(projectId);
    }

    const result = await database.queryOne<{ total: number }>(query, params);
    return result?.total || 0;
  }

  /**
   * Get task with assignee details
   */
  public static async findByIdWithDetails(id: number): Promise<any> {
    const query = `
      SELECT 
        t.id, t.project_id, t.title, t.description, t.assignee_id, t.status, t.priority, t.due_date, t.created_at, t.updated_at, t.deleted_at,
        u.username as assignee_username, u.email as assignee_email,
        p.name as project_name,
        COUNT(c.id) as comment_count
      FROM tasks t
      LEFT JOIN users u ON t.assignee_id = u.id
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN comments c ON t.id = c.task_id
      WHERE t.id = ? AND t.deleted_at IS NULL
      GROUP BY t.id
    `;

    return await database.queryOne(query, [id]);
  }
}
