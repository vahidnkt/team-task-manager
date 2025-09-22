// Centralized configuration file
// Consolidates all app settings, environment variables, and constants

// Environment Configuration
interface EnvConfig {
  API_BASE_URL: string;
  APP_NAME: string;
  ENABLE_DEVTOOLS: boolean;
  JWT_SECRET_KEY: string;
  REFRESH_TOKEN_KEY: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

const getBooleanEnvVar = (
  key: string,
  defaultValue: boolean = false
): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value === "true" || value === "1";
};

export const env: EnvConfig = {
  API_BASE_URL: getEnvVar("VITE_API_BASE_URL"),
  APP_NAME: getEnvVar("VITE_APP_NAME"),
  ENABLE_DEVTOOLS: getBooleanEnvVar("VITE_ENABLE_DEVTOOLS", false),
  JWT_SECRET_KEY: getEnvVar("VITE_JWT_SECRET_KEY"),
  REFRESH_TOKEN_KEY: getEnvVar("VITE_REFRESH_TOKEN_KEY"),
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: env.API_BASE_URL,
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// HTTP Status Codes
export const HTTP_STATUS = {
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

// Re-export API endpoints from api.ts
export { API_ENDPOINTS } from "./api";

// App Constants
export const APP_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Task priorities
  TASK_PRIORITIES: ["low", "medium", "high", "urgent"] as const,

  // Task statuses
  TASK_STATUSES: ["todo", "in_progress", "in_review", "done"] as const,

  // Project statuses
  PROJECT_STATUSES: ["active", "completed", "on_hold", "cancelled"] as const,

  // User roles
  USER_ROLES: ["user", "admin"] as const,

  // Theme
  THEMES: ["light", "dark"] as const,

  // Local storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: "auth_token",
    REFRESH_TOKEN: "refresh_token",
    USER_DATA: "user_data",
    THEME: "theme",
    SIDEBAR_COLLAPSED: "sidebar_collapsed",
  },

  // Toast durations
  TOAST_DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    WARNING: 4000,
    INFO: 3000,
  },

  // Form validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 50,
    MIN_PROJECT_NAME_LENGTH: 3,
    MAX_PROJECT_NAME_LENGTH: 100,
    MIN_TASK_TITLE_LENGTH: 3,
    MAX_TASK_TITLE_LENGTH: 200,
    MAX_TASK_DESCRIPTION_LENGTH: 1000,
    MAX_COMMENT_LENGTH: 500,
  },
} as const;

// Request Headers
export const getDefaultHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
  Accept: "application/json",
});

export const getAuthHeaders = (token: string): Record<string, string> => ({
  ...getDefaultHeaders(),
  Authorization: `Bearer ${token}`,
});

// URL Builder
export const buildUrl = (
  baseUrl: string,
  endpoint: string,
  params?: Record<string, string>
): string => {
  const url = new URL(endpoint, baseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
};

// Error Handling
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

// Validate required environment variables
export const validateEnv = (): void => {
  const requiredVars = [
    "VITE_API_BASE_URL",
    "VITE_APP_NAME",
    "VITE_JWT_SECRET_KEY",
    "VITE_REFRESH_TOKEN_KEY",
  ];

  requiredVars.forEach((varName) => {
    if (!import.meta.env[varName]) {
      throw new Error(`Required environment variable ${varName} is not set`);
    }
  });
};

// Export individual environment variables for convenience
export const {
  API_BASE_URL,
  APP_NAME,
  ENABLE_DEVTOOLS,
  JWT_SECRET_KEY,
  REFRESH_TOKEN_KEY,
} = env;
