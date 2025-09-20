import { Sequelize } from "sequelize-typescript";
import { QueryTypes } from "sequelize";
import { SequelizeConnection } from "./sequelize-connection";
import { SequelizeFactory } from "./sequelize-factory";

/**
 * Main Sequelize Database Class
 * Uses component-based architecture for better maintainability
 */
class SequelizeDatabase {
  private static instance: SequelizeDatabase;
  private connection: SequelizeConnection | null = null;

  private constructor() {}

  public static getInstance(): SequelizeDatabase {
    if (!SequelizeDatabase.instance) {
      SequelizeDatabase.instance = new SequelizeDatabase();
    }
    return SequelizeDatabase.instance;
  }

  public async connect(): Promise<void> {
    try {
      // Use Factory to create and connect
      this.connection = new SequelizeConnection();
      await this.connection.connect();
    } catch (error) {
      console.error("❌ Sequelize Database connection failed:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.disconnect();
        this.connection = null;
      }
    } catch (error) {
      console.error("❌ Error closing Sequelize database connection:", error);
      throw error;
    }
  }

  public getSequelize(): Sequelize {
    if (!this.connection) {
      throw new Error("Sequelize not initialized");
    }
    return this.connection.getSequelize();
  }

  // Legacy methods for backward compatibility
  public async execute<T = any>(query: string, params: any[] = []): Promise<T> {
    if (!this.connection) {
      throw new Error("Sequelize not initialized");
    }
    return this.connection.execute<T>(query, params);
  }

  public async query<T = any>(query: string, params: any[] = []): Promise<T[]> {
    if (!this.connection) {
      throw new Error("Sequelize not initialized");
    }
    return this.connection.query<T>(query, params);
  }

  public async queryOne<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T | null> {
    if (!this.connection) {
      throw new Error("Sequelize not initialized");
    }
    return this.connection.queryOne<T>(query, params);
  }

  public async healthCheck(): Promise<boolean> {
    if (!this.connection) {
      return false;
    }
    return this.connection.healthCheck();
  }
}

// Export singleton instance
export default SequelizeDatabase.getInstance();
