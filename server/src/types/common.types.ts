// Common Types
export interface Timestamps {
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface SoftDelete {
  deleted_at?: Date;
}

// Error Types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface FieldError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Utility Types
export type Status = "active" | "inactive" | "pending" | "suspended";

export type Priority = "low" | "medium" | "high" | "urgent";

export type UserRole = "user" | "admin" | "super_admin";

// Environment Types
export type Environment = "development" | "staging" | "production" | "test";

// Logging Types
export interface LogLevel {
  ERROR: "error";
  WARN: "warn";
  INFO: "info";
  DEBUG: "debug";
}

export type LogLevelType = LogLevel[keyof LogLevel];

// Configuration Types
export interface ServerConfig {
  port: number;
  env: Environment;
  host?: string;
}

export interface SecurityConfig {
  bcryptSaltRounds: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  corsOrigin: string;
}

export interface LoggingConfig {
  level: LogLevelType;
  file: string;
  maxSize: string;
  maxFiles: number;
  datePattern: string;
}

export interface AppConfig {
  name: string;
  version: string;
  description: string;
}
