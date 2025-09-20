import { Sequelize } from "sequelize-typescript";
import { QueryTypes } from "sequelize";
import { getSequelizeConfig } from "./sequelize-config";
import { addModelsToSequelize, validateModels } from "./sequelize-models";

/**
 * Sequelize Connection Component
 * Handles Sequelize connection lifecycle
 */
export class SequelizeConnection {
  private sequelize: Sequelize | null = null;
  private isConnected: boolean = false;

  /**
   * Connect to database with Sequelize
   */
  public async connect(): Promise<Sequelize> {
    try {
      // Validate models first
      if (!validateModels()) {
        throw new Error("Model validation failed");
      }

      // Get configuration
      const sequelizeOptions = getSequelizeConfig();

      // Create Sequelize instance
      this.sequelize = new Sequelize(sequelizeOptions);

      // Add models
      addModelsToSequelize(this.sequelize);

      // Test connection
      await this.sequelize.authenticate();
      console.log("✅ Sequelize authentication successful");

      // Sync database (create tables if they don't exist)
      await this.sequelize.sync();
      console.log("✅ Sequelize Database connected and synced successfully");

      this.isConnected = true;
      return this.sequelize;
    } catch (error) {
      console.error("❌ Sequelize Database connection failed:", error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Get Sequelize instance
   */
  public getSequelize(): Sequelize {
    if (!this.sequelize || !this.isConnected) {
      throw new Error("Sequelize not initialized or not connected");
    }
    return this.sequelize;
  }

  /**
   * Check if connected
   */
  public isConnectedToDatabase(): boolean {
    return this.isConnected && this.sequelize !== null;
  }

  /**
   * Disconnect from database
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.sequelize && this.isConnected) {
        await this.sequelize.close();
        this.sequelize = null;
        this.isConnected = false;
        console.log("📴 Sequelize Database disconnected");
      }
    } catch (error) {
      console.error("❌ Error closing Sequelize database connection:", error);
      throw error;
    }
  }

  /**
   * Health check
   */
  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.sequelize || !this.isConnected) {
        return false;
      }

      await this.sequelize.authenticate();
      return true;
    } catch (error) {
      console.error("❌ Sequelize health check failed:", error);
      return false;
    }
  }

  /**
   * Legacy methods for backward compatibility
   */
  public async execute<T = any>(query: string, params: any[] = []): Promise<T> {
    if (!this.sequelize) {
      throw new Error("Sequelize not initialized");
    }

    try {
      const result = await this.sequelize.query(query, {
        replacements: params,
        type: QueryTypes.SELECT,
      });
      return result as T;
    } catch (error) {
      console.error("❌ Sequelize Database execute error:", error);
      throw error;
    }
  }

  public async query<T = any>(query: string, params: any[] = []): Promise<T[]> {
    if (!this.sequelize) {
      throw new Error("Sequelize not initialized");
    }

    try {
      const result = await this.sequelize.query(query, {
        replacements: params,
        type: QueryTypes.SELECT,
      });
      return result as unknown as T[];
    } catch (error) {
      console.error("❌ Sequelize Database query error:", error);
      throw error;
    }
  }

  public async queryOne<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T | null> {
    const results = await this.query<T>(query, params);
    return results.length > 0 ? (results[0] as T) : null;
  }
}
