import database from "../config/database";
import {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../types/comment.types";

export class CommentModel {
  // Create a new comment
  public static async create(
    commentData: CreateCommentRequest
  ): Promise<Comment> {
    const { task_id, commenter_id, text } = commentData;

    const result = await database.execute(
      `INSERT INTO comments (task_id, commenter_id, text, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [task_id, commenter_id, text]
    );

    const newComment = await this.findById(result.insertId);
    if (!newComment) {
      throw new Error("Failed to create comment");
    }

    return newComment;
  }

  // Find comment by ID
  public static async findById(id: number): Promise<Comment | null> {
    const rows = await database.query(
      `SELECT c.*, u.username as commenter_username
       FROM comments c
       JOIN users u ON c.commenter_id = u.id
       WHERE c.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return this.mapRowToComment(rows[0]);
  }

  // Get all comments for a task
  public static async findByTaskId(taskId: number): Promise<Comment[]> {
    const rows = await database.query(
      `SELECT c.*, u.username as commenter_username
       FROM comments c
       JOIN users u ON c.commenter_id = u.id
       WHERE c.task_id = ?
       ORDER BY c.created_at ASC`,
      [taskId]
    );

    return rows.map((row) => this.mapRowToComment(row));
  }

  // Get comments by user
  public static async findByUserId(
    userId: number,
    limit?: number,
    offset?: number
  ): Promise<Comment[]> {
    let query = `
      SELECT c.*, u.username as commenter_username, t.title as task_title
      FROM comments c
      JOIN users u ON c.commenter_id = u.id
      JOIN tasks t ON c.task_id = t.id
      WHERE c.commenter_id = ?
      ORDER BY c.created_at DESC
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

    return rows.map((row) => this.mapRowToComment(row));
  }

  // Update comment
  public static async update(
    id: number,
    updateData: UpdateCommentRequest
  ): Promise<Comment | null> {
    const { text } = updateData;

    const result = await database.execute(
      `UPDATE comments
       SET text = ?, updated_at = NOW()
       WHERE id = ?`,
      [text, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return await this.findById(id);
  }

  // Delete comment
  public static async delete(id: number): Promise<boolean> {
    const result = await database.execute("DELETE FROM comments WHERE id = ?", [
      id,
    ]);

    return result.affectedRows > 0;
  }

  // Get recent comments across all tasks (admin function)
  public static async findRecent(
    limit: number = 50,
    offset: number = 0
  ): Promise<Comment[]> {
    const rows = await database.query(
      `SELECT c.*, u.username as commenter_username, t.title as task_title, p.name as project_name
       FROM comments c
       JOIN users u ON c.commenter_id = u.id
       JOIN tasks t ON c.task_id = t.id
       JOIN projects p ON t.project_id = p.id
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return rows.map((row) => this.mapRowToComment(row));
  }

  // Get comment count for a task
  public static async getTaskCommentCount(taskId: number): Promise<number> {
    const rows = await database.query(
      "SELECT COUNT(*) as count FROM comments WHERE task_id = ?",
      [taskId]
    );

    return rows[0].count;
  }

  // Get comment count by user
  public static async getUserCommentCount(userId: number): Promise<number> {
    const rows = await database.query(
      "SELECT COUNT(*) as count FROM comments WHERE commenter_id = ?",
      [userId]
    );

    return rows[0].count;
  }

  // Search comments by text
  public static async searchByText(
    searchTerm: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Comment[]> {
    const rows = await database.query(
      `SELECT c.*, u.username as commenter_username, t.title as task_title
       FROM comments c
       JOIN users u ON c.commenter_id = u.id
       JOIN tasks t ON c.task_id = t.id
       WHERE c.text LIKE ?
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [`%${searchTerm}%`, limit, offset]
    );

    return rows.map((row) => this.mapRowToComment(row));
  }

  // Check if user can modify comment (user is comment author or admin)
  public static async canUserModifyComment(
    commentId: number,
    userId: number,
    userRole: string
  ): Promise<boolean> {
    if (userRole === "admin") {
      return true;
    }

    const rows = await database.query(
      "SELECT commenter_id FROM comments WHERE id = ?",
      [commentId]
    );

    if (rows.length === 0) {
      return false;
    }

    return rows[0].commenter_id === userId;
  }

  // Private method to map database row to Comment object
  private static mapRowToComment(row: any): Comment {
    return {
      id: row.id,
      task_id: row.task_id,
      commenter_id: row.commenter_id,
      text: row.text,
      created_at: row.created_at,
      updated_at: row.updated_at,
      commenter_username: row.commenter_username,
      task_title: row.task_title,
      project_name: row.project_name,
    };
  }
}
