// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  details?: any;
}

export interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
}

// HTTP Status Codes
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusType = (typeof HttpStatus)[keyof typeof HttpStatus];

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

// TaskStatus is defined in task.types.ts

// Environment Types
export type Environment = "development" | "staging" | "production" | "test";

// Database types are defined in database.types.ts
