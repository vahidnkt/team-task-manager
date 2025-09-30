import dotenv from "dotenv";
import path from "path";
import { DatabaseConfig } from "../types";

// Load environment variables from .env file in server root
dotenv.config({ path: path.join(__dirname, "../../.env") });

interface CORSConfig {
  origin: string | string[];
  credentials: boolean;
  methods: string[];
  allowedHeaders: string[];
}

interface JWTConfig {
  secret: string;
  expiresIn: string;
  algorithm: string;
  refreshTokenExpiresIn: string;
}

interface SecurityConfig {
  bcryptSaltRounds: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  corsOrigin: string;
}

interface LoggingConfig {
  level: string;
  file: string;
  maxSize: string;
  maxFiles: number;
  datePattern: string;
}

interface AppConfig {
  name: string;
  version: string;
  description: string;
}

interface ServerConfig {
  port: number;
  env: string;
}

interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
  jwt: JWTConfig;
  security: SecurityConfig;
  cors: CORSConfig;
  logging: LoggingConfig;
  app: AppConfig;
}

const config: Config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || "3000"),
    env:
      (process.env.NODE_ENV as "development" | "production" | "test") ||
      "development",
  },

  // Database Configuration
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    name: process.env.DB_NAME || "team_task_manager",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    charset: "utf8mb4",
    timezone: "+00:00",
  },

  // JWT Configuration
  jwt: {
    secret:
      process.env.JWT_SECRET ||
      "fallback_secret_key_please_change_in_production",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    algorithm: "HS256",
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  // Security Configuration
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12"),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
    rateLimitMaxRequests: parseInt(
      process.env.RATE_LIMIT_MAX_REQUESTS || "100"
    ),
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },

  // CORS Configuration add succufully
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
      : [
          "https://team-task-manager-1-6dl6.onrender.com",
          "http://localhost:3000",
          "http://localhost:5173",
        ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },

  // Logging Configuration
  logging: {
    level:
      (process.env.LOG_LEVEL as "error" | "warn" | "info" | "debug") || "info",
    file: process.env.LOG_FILE || "logs/app.log",
    maxSize: "10m",
    maxFiles: 5,
    datePattern: "YYYY-MM-DD",
  },

  // Application Configuration
  app: {
    name: process.env.APP_NAME || "Team Task Manager",
    version: process.env.APP_VERSION || "1.0.0",
    description:
      "A comprehensive Team Task Manager application with role-based access control",
  },
};

// Validation function to check required environment variables
const validateConfig = (): void => {
  const required = ["DB_HOST", "DB_NAME", "DB_USER", "JWT_SECRET"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Warn if using default JWT secret in production
  if (
    config.server.env === "production" &&
    process.env.JWT_SECRET === "fallback_secret_key_please_change_in_production"
  ) {
    console.warn(
      "⚠️  WARNING: Using default JWT secret in production! Please set a secure JWT_SECRET."
    );
  }
};

// Validate configuration on load
if (config.server.env !== "test") {
  validateConfig();
}

export default config;
