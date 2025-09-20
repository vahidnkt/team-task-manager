import mysql from "mysql2/promise";
import config from "../environment";
import { DatabaseConnection } from "../../types/database.types";

class Database {
  private static instance: Database;
  private pool: mysql.Pool | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      const dbConfig: DatabaseConnection = {
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name,
        charset: config.database.charset,
        timezone: config.database.timezone,
      };

      this.pool = mysql.createPool({
        ...dbConfig,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true,
      });

      // Test the connection
      const connection = await this.pool.getConnection();
      console.log("✅ Database connected successfully");
      connection.release();
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  public getPool(): mysql.Pool {
    if (!this.pool) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.pool;
  }

  public async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    if (!this.pool) {
      throw new Error("Database not connected. Call connect() first.");
    }

    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows as T[];
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  public async queryOne<T = any>(
    sql: string,
    params?: any[]
  ): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows.length > 0 ? rows[0] ?? null : null;
  }

  public async execute(
    sql: string,
    params?: any[]
  ): Promise<mysql.ResultSetHeader> {
    if (!this.pool) {
      throw new Error("Database not connected. Call connect() first.");
    }

    try {
      const [result] = await this.pool.execute(sql, params);
      return result as mysql.ResultSetHeader;
    } catch (error) {
      console.error("Database execute error:", error);
      throw error;
    }
  }

  public async transaction<T>(
    callback: (connection: mysql.PoolConnection) => Promise<T>
  ): Promise<T> {
    if (!this.pool) {
      throw new Error("Database not connected. Call connect() first.");
    }

    const connection = await this.pool.getConnection();
    await connection.beginTransaction();

    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  public async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log("📴 Database disconnected");
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.pool) {
        return false;
      }

      await this.query("SELECT 1");
      return true;
    } catch (error) {
      console.error("Database health check failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export default Database.getInstance();
