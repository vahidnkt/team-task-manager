/**
 * Application constants for the task manager
 */

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Task statuses
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done'
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

// Task priorities
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

export type TaskPriority = typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY];

// Activity actions
export const ACTIVITY_ACTIONS = {
  // Project actions
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  PROJECT_DELETED: 'project_deleted',
  PROJECT_ARCHIVED: 'project_archived',
  PROJECT_DUPLICATED: 'project_duplicated',

  // Task actions
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_DELETED: 'task_deleted',
  TASK_ASSIGNED: 'task_assigned',
  TASK_UNASSIGNED: 'task_unassigned',
  TASK_MOVED: 'task_moved',
  TASK_DUPLICATED: 'task_duplicated',
  STATUS_CHANGED: 'status_changed',
  PRIORITY_CHANGED: 'priority_changed',
  DUE_DATE_SET: 'due_date_set',
  DUE_DATE_CHANGED: 'due_date_changed',
  DUE_DATE_REMOVED: 'due_date_removed',

  // Comment actions
  COMMENT_ADDED: 'comment_added',
  COMMENT_UPDATED: 'comment_updated',
  COMMENT_DELETED: 'comment_deleted',

  // User actions
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',

  // File actions (for future enhancement)
  FILE_ATTACHED: 'file_attached',
  FILE_REMOVED: 'file_removed'
} as const;

export type ActivityAction = typeof ACTIVITY_ACTIONS[keyof typeof ACTIVITY_ACTIONS];

// HTTP status codes
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
  INTERNAL_SERVER_ERROR: 500
} as const;

// API response messages
export const API_MESSAGES = {
  // Success messages
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',

  // Error messages
  VALIDATION_ERROR: 'Validation failed',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource already exists',
  INTERNAL_ERROR: 'Internal server error',

  // Specific messages
  USER_NOT_FOUND: 'User not found',
  PROJECT_NOT_FOUND: 'Project not found',
  TASK_NOT_FOUND: 'Task not found',
  COMMENT_NOT_FOUND: 'Comment not found',

  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already exists',
  USERNAME_EXISTS: 'Username already exists',

  ADMIN_REQUIRED: 'Admin access required',
  OWNER_REQUIRED: 'Resource owner or admin access required',

  INVALID_STATUS: 'Invalid task status',
  INVALID_PRIORITY: 'Invalid task priority',
  INVALID_ROLE: 'Invalid user role'
} as const;

// Validation rules
export const VALIDATION_RULES = {
  // User validation
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },

  EMAIL: {
    MAX_LENGTH: 100,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },

  PASSWORD: {
    MIN_LENGTH: 6,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  },

  // Project validation
  PROJECT_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255
  },

  PROJECT_DESCRIPTION: {
    MAX_LENGTH: 1000
  },

  // Task validation
  TASK_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255
  },

  TASK_DESCRIPTION: {
    MAX_LENGTH: 1000
  },

  // Comment validation
  COMMENT_TEXT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000
  }
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0
} as const;

// JWT configuration
export const JWT = {
  DEFAULT_EXPIRES_IN: '24h',
  REFRESH_EXPIRES_IN: '7d'
} as const;

// Bcrypt configuration
export const BCRYPT = {
  DEFAULT_SALT_ROUNDS: 12
} as const;

// Database configuration
export const DATABASE = {
  CONNECTION_LIMIT: 10,
  ACQUIRE_TIMEOUT: 60000,
  TIMEOUT: 60000
} as const;

// File upload limits (for future enhancement)
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
} as const;

// Email configuration (for future enhancement)
export const EMAIL = {
  FROM_ADDRESS: 'noreply@taskmanager.com',
  FROM_NAME: 'Task Manager'
} as const;

// Rate limiting (for future enhancement)
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100
} as const;

// Logging levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
} as const;

// Date formats
export const DATE_FORMATS = {
  ISO_DATE: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ssZ',
  DISPLAY_DATE: 'MMM DD, YYYY',
  DISPLAY_DATETIME: 'MMM DD, YYYY hh:mm A'
} as const;

// Regular expressions
export const REGEX = {
  USERNAME: VALIDATION_RULES.USERNAME.PATTERN,
  EMAIL: VALIDATION_RULES.EMAIL.PATTERN,
  PASSWORD: VALIDATION_RULES.PASSWORD.PATTERN,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
} as const;

// Time constants
export const TIME = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000
} as const;

// Environment types
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  TESTING: 'testing',
  STAGING: 'staging',
  PRODUCTION: 'production'
} as const;

// API version
export const API_VERSION = 'v1';

// Application metadata
export const APP_INFO = {
  NAME: 'Task Manager API',
  VERSION: '1.0.0',
  DESCRIPTION: 'A comprehensive team task management system',
  AUTHOR: 'Task Manager Team'
} as const;

// Default values
export const DEFAULTS = {
  USER_ROLE: USER_ROLES.USER,
  TASK_STATUS: TASK_STATUS.TODO,
  TASK_PRIORITY: TASK_PRIORITY.MEDIUM,
  PAGE_SIZE: PAGINATION.DEFAULT_LIMIT,
  BCRYPT_ROUNDS: BCRYPT.DEFAULT_SALT_ROUNDS
} as const;

// Error codes (for internal use)
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

// Export grouped constants for convenience
export const CONSTANTS = {
  USER_ROLES,
  TASK_STATUS,
  TASK_PRIORITY,
  ACTIVITY_ACTIONS,
  HTTP_STATUS,
  API_MESSAGES,
  VALIDATION_RULES,
  PAGINATION,
  JWT,
  BCRYPT,
  DATABASE,
  FILE_UPLOAD,
  EMAIL,
  RATE_LIMIT,
  LOG_LEVELS,
  DATE_FORMATS,
  REGEX,
  TIME,
  ENVIRONMENTS,
  API_VERSION,
  APP_INFO,
  DEFAULTS,
  ERROR_CODES
} as const;