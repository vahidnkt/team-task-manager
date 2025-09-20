import database from "../config/database";
import { Project, CreateProjectRequest, UpdateProjectRequest } from "../types";

export class ProjectModel {
  /**
   * Create a new project
   */
  public static async create(
    projectData: CreateProjectRequest,
    createdBy: number
  ): Promise<Project> {
    const query = `
      INSERT INTO projects (name, description, created_by)
      VALUES (?, ?, ?)
    `;

    const result = await database.execute(query, [
      projectData.name,
      projectData.description || null,
      createdBy,
    ]);

    const newProject = await this.findById(result.insertId);
    if (!newProject) {
      throw new Error("Failed to create project");
    }

    return newProject;
  }

  /**
   * Find project by ID
   */
  public static async findById(id: number): Promise<Project | null> {
    const query = `
      SELECT id, name, description, created_by, created_at, updated_at, deleted_at
      FROM projects 
      WHERE id = ? AND deleted_at IS NULL
    `;

    return await database.queryOne<Project>(query, [id]);
  }

  /**
   * Get all projects (with pagination)
   */
  public static async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<Project[]> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, name, description, created_by, created_at, updated_at, deleted_at
      FROM projects 
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    return await database.query<Project>(query, [limit, offset]);
  }

  /**
   * Get projects by creator
   */
  public static async findByCreator(
    createdBy: number,
    page: number = 1,
    limit: number = 10
  ): Promise<Project[]> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, name, description, created_by, created_at, updated_at, deleted_at
      FROM projects 
      WHERE created_by = ? AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    return await database.query<Project>(query, [createdBy, limit, offset]);
  }

  /**
   * Update project
   */
  public static async update(
    id: number,
    projectData: UpdateProjectRequest
  ): Promise<Project | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (projectData.name) {
      fields.push("name = ?");
      values.push(projectData.name);
    }
    if (projectData.description !== undefined) {
      fields.push("description = ?");
      values.push(projectData.description);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE projects 
      SET ${fields.join(", ")}
      WHERE id = ? AND deleted_at IS NULL
    `;

    await database.execute(query, values);
    return await this.findById(id);
  }

  /**
   * Soft delete project
   */
  public static async delete(id: number): Promise<boolean> {
    const query = `
      UPDATE projects 
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL
    `;

    const result = await database.execute(query, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Count total projects
   */
  public static async count(): Promise<number> {
    const query = `
      SELECT COUNT(*) as total
      FROM projects 
      WHERE deleted_at IS NULL
    `;

    const result = await database.queryOne<{ total: number }>(query);
    return result?.total || 0;
  }

  /**
   * Count projects by creator
   */
  public static async countByCreator(createdBy: number): Promise<number> {
    const query = `
      SELECT COUNT(*) as total
      FROM projects 
      WHERE created_by = ? AND deleted_at IS NULL
    `;

    const result = await database.queryOne<{ total: number }>(query, [
      createdBy,
    ]);
    return result?.total || 0;
  }

  /**
   * Check if project exists
   */
  public static async exists(id: number): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM projects 
      WHERE id = ? AND deleted_at IS NULL
    `;

    const result = await database.queryOne<{ count: number }>(query, [id]);
    return (result?.count || 0) > 0;
  }

  /**
   * Get project with statistics
   */
  public static async findByIdWithStats(id: number): Promise<any> {
    const query = `
      SELECT 
        p.id, p.name, p.description, p.created_by, p.created_at, p.updated_at, p.deleted_at,
        COUNT(t.id) as task_count,
        SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN t.status = 'in-progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN t.status = 'todo' THEN 1 ELSE 0 END) as pending_tasks
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id AND t.deleted_at IS NULL
      WHERE p.id = ? AND p.deleted_at IS NULL
      GROUP BY p.id
    `;

    return await database.queryOne(query, [id]);
  }
}
