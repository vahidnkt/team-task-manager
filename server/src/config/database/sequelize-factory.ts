import { Sequelize } from "sequelize-typescript";
import { getSequelizeConfig } from "./sequelize-config";
import { addModelsToSequelize, validateModels } from "./sequelize-models";

/**
 * Sequelize Factory Component
 * Creates and configures Sequelize instances
 */
export class SequelizeFactory {
  /**
   * Create a new Sequelize instance
   */
  public static createSequelize(): Sequelize {
    // Validate models first
    if (!validateModels()) {
      throw new Error("Model validation failed");
    }

    const config = getSequelizeConfig();
    const sequelize = new Sequelize(config);

    // Add models
    addModelsToSequelize(sequelize);

    return sequelize;
  }

  /**
   * Create and connect Sequelize instance
   */
  public static async createAndConnect(): Promise<Sequelize> {
    const sequelize = this.createSequelize();

    try {
      // Test connection
      await sequelize.authenticate();
      console.log("✅ Sequelize authentication successful");

      // Sync database
      await sequelize.sync();
      console.log("✅ Sequelize Database connected and synced successfully");

      return sequelize;
    } catch (error) {
      console.error("❌ Sequelize connection failed:", error);
      throw error;
    }
  }

  /**
   * Create Sequelize instance for testing
   */
  public static createTestSequelize(): Sequelize {
    const config = getSequelizeConfig();

    // Override config for testing
    const testConfig = {
      ...config,
      logging: false,
      sync: { force: true }, // Drop and recreate tables for tests
    };

    const sequelize = new Sequelize(testConfig);
    addModelsToSequelize(sequelize);

    return sequelize;
  }

  /**
   * Create Sequelize instance with custom configuration
   */
  public static createSequelizeWithConfig(
    customConfig: Partial<any>
  ): Sequelize {
    const baseConfig = getSequelizeConfig();
    const config = { ...baseConfig, ...customConfig };

    const sequelize = new Sequelize(config);
    addModelsToSequelize(sequelize);

    return sequelize;
  }
}
