import { SequelizeOptions } from "sequelize-typescript";
import config from "../environment";

/**
 * Sequelize Configuration Component
 * Centralizes all Sequelize configuration options
 */
export const getSequelizeConfig = (): SequelizeOptions => ({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  dialect: "mysql" as const,
  sync: {
    force: false, // Don't drop tables
  },
  logging: config.server.env === "development" ? console.log : false,
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 50000,
    idle: 10000,
  },
});

/**
 * Get Sequelize configuration for specific environment
 */
export const getSequelizeConfigForEnv = (env: string): SequelizeOptions => {
  const baseConfig = getSequelizeConfig();

  // Override logging based on environment
  if (env === "test") {
    baseConfig.logging = false;
  } else if (env === "production") {
    baseConfig.logging = false;
    baseConfig.pool = {
      ...baseConfig.pool,
      max: 10, // Increase pool size for production
    };
  }

  return baseConfig;
};

/**
 * Get Sequelize configuration with custom options
 */
export const getSequelizeConfigWithOptions = (
  overrides: Partial<SequelizeOptions>
): SequelizeOptions => {
  const baseConfig = getSequelizeConfig();
  return { ...baseConfig, ...overrides };
};
