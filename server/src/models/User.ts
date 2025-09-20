import database from "../config/database";
import { User, CreateUserRequest, UpdateUserRequest } from "../types";

export class UserModel {
  /**
   * Create a new user
   */
  public static async create(
    userData: CreateUserRequest & { password_hash: string }
  ): Promise<User> {
    const query = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;

    const result = await database.execute(query, [
      userData.username,
      userData.email,
      userData.password_hash,
      userData.role || "user",
    ]);

    const newUser = await this.findById(result.insertId);
    if (!newUser) {
      throw new Error("Failed to create user");
    }

    return newUser;
  }

  /**
   * Find user by ID
   */
  public static async findById(id: number): Promise<User | null> {
    const query = `
      SELECT id, username, email, password_hash, role, created_at, updated_at, deleted_at
      FROM users 
      WHERE id = ? AND deleted_at IS NULL
    `;

    return await database.queryOne<User>(query, [id]);
  }

  /**
   * Find user by email
   */
  public static async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, username, email, password_hash, role, created_at, updated_at, deleted_at
      FROM users 
      WHERE email = ? AND deleted_at IS NULL
    `;

    return await database.queryOne<User>(query, [email]);
  }

  /**
   * Find user by username
   */
  public static async findByUsername(username: string): Promise<User | null> {
    const query = `
      SELECT id, username, email, password_hash, role, created_at, updated_at, deleted_at
      FROM users 
      WHERE username = ? AND deleted_at IS NULL
    `;

    return await database.queryOne<User>(query, [username]);
  }

  /**
   * Get all users (with pagination)
   */
  public static async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<User[]> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, username, email, password_hash, role, created_at, updated_at, deleted_at
      FROM users 
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    return await database.query<User>(query, [limit, offset]);
  }

  /**
   * Update user
   */
  public static async update(
    id: number,
    userData: UpdateUserRequest
  ): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (userData.username) {
      fields.push("username = ?");
      values.push(userData.username);
    }
    if (userData.email) {
      fields.push("email = ?");
      values.push(userData.email);
    }
    if (userData.password) {
      fields.push("password_hash = ?");
      values.push(userData.password);
    }
    if (userData.role) {
      fields.push("role = ?");
      values.push(userData.role);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE users 
      SET ${fields.join(", ")}
      WHERE id = ? AND deleted_at IS NULL
    `;

    await database.execute(query, values);
    return await this.findById(id);
  }

  /**
   * Soft delete user
   */
  public static async delete(id: number): Promise<boolean> {
    const query = `
      UPDATE users 
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL
    `;

    const result = await database.execute(query, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Count total users
   */
  public static async count(): Promise<number> {
    const query = `
      SELECT COUNT(*) as total
      FROM users 
      WHERE deleted_at IS NULL
    `;

    const result = await database.queryOne<{ total: number }>(query);
    return result?.total || 0;
  }

  /**
   * Check if email exists
   */
  public static async emailExists(
    email: string,
    excludeId?: number
  ): Promise<boolean> {
    let query = `
      SELECT COUNT(*) as count
      FROM users 
      WHERE email = ? AND deleted_at IS NULL
    `;
    const params: any[] = [email];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const result = await database.queryOne<{ count: number }>(query, params);
    return (result?.count || 0) > 0;
  }

  /**
   * Check if username exists
   */
  public static async usernameExists(
    username: string,
    excludeId?: number
  ): Promise<boolean> {
    let query = `
      SELECT COUNT(*) as count
      FROM users 
      WHERE username = ? AND deleted_at IS NULL
    `;
    const params: any[] = [username];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const result = await database.queryOne<{ count: number }>(query, params);
    return (result?.count || 0) > 0;
  }
}
