// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

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

// User Roles
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

// Task Statuses
export const TASK_STATUSES = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  IN_REVIEW: "in_review",
  DONE: "done",
} as const;

// Task Priorities
export const TASK_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

// Project Statuses
export const PROJECT_STATUSES = {
  ACTIVE: "active",
  COMPLETED: "completed",
  ON_HOLD: "on_hold",
  CANCELLED: "cancelled",
} as const;

// Theme Options
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  THEME: "theme",
  SIDEBAR_COLLAPSED: "sidebar_collapsed",
  RECENT_PROJECTS: "recent_projects",
  DASHBOARD_LAYOUT: "dashboard_layout",
} as const;

// Toast Configuration
export const TOAST_CONFIG = {
  DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    WARNING: 4000,
    INFO: 3000,
  },
  POSITION: "topRight" as const,
} as const;

// Form Validation
export const VALIDATION_RULES = {
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
  MAX_PROJECT_DESCRIPTION_LENGTH: 500,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  MAX_FILES: 5,
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: "MMM dd, yyyy",
  LONG: "EEEE, MMMM dd, yyyy",
  TIME: "h:mm a",
  DATETIME: "MMM dd, yyyy 'at' h:mm a",
  ISO: "yyyy-MM-dd",
  INPUT_DATETIME: "yyyy-MM-dd'T'HH:mm",
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied. You don't have permission.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
  LOGIN_REQUIRED: "Please login to continue.",
  SESSION_EXPIRED: "Your session has expired. Please login again.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Welcome back!",
  LOGOUT_SUCCESS: "You have been logged out successfully.",
  REGISTER_SUCCESS: "Account created successfully!",
  PROFILE_UPDATED: "Profile updated successfully.",
  PASSWORD_CHANGED: "Password changed successfully.",
  PROJECT_CREATED: "Project created successfully.",
  PROJECT_UPDATED: "Project updated successfully.",
  PROJECT_DELETED: "Project deleted successfully.",
  TASK_CREATED: "Task created successfully.",
  TASK_UPDATED: "Task updated successfully.",
  TASK_DELETED: "Task deleted successfully.",
  TASK_ASSIGNED: "Task assigned successfully.",
  COMMENT_ADDED: "Comment added successfully.",
  COMMENT_UPDATED: "Comment updated successfully.",
  COMMENT_DELETED: "Comment deleted successfully.",
  USER_CREATED: "User created successfully.",
  USER_UPDATED: "User updated successfully.",
  USER_DELETED: "User deleted successfully.",
} as const;

// Route Paths
export const ROUTES = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Dashboard
  DASHBOARD: "/dashboard",
  ADMIN_DASHBOARD: "/admin",

  // Projects
  PROJECTS: "/projects",
  CREATE_PROJECT: "/projects/new",
  PROJECT_DETAIL: (id: string) => `/projects/${id}`,
  EDIT_PROJECT: (id: string) => `/projects/${id}/edit`,

  // Tasks
  TASKS: "/tasks",
  CREATE_TASK: "/tasks/new",
  TASK_DETAIL: (id: string) => `/tasks/${id}`,
  EDIT_TASK: (id: string) => `/tasks/${id}/edit`,
  TASK_COMMENTS: (id: string) => `/tasks/${id}/comments`,

  // Users
  USERS: "/users",
  USER_DETAIL: (id: string) => `/users/${id}`,

  // Profile
  PROFILE: "/profile",
  CHANGE_PASSWORD: "/profile/change-password",

  // Other
  NOT_FOUND: "*",
} as const;

// Query Keys for React Query (if used)
export const QUERY_KEYS = {
  USER_PROFILE: ["user", "profile"],
  PROJECTS: ["projects"],
  PROJECT_DETAIL: (id: string) => ["projects", id],
  TASKS: ["tasks"],
  TASK_DETAIL: (id: string) => ["tasks", id],
  COMMENTS: (taskId: string) => ["tasks", taskId, "comments"],
  ACTIVITIES: ["activities"],
  USERS: ["users"],
  USER_DETAIL: (id: string) => ["users", id],
} as const;

// Activity Types
export const ACTIVITY_TYPES = {
  PROJECT_CREATED: "project_created",
  PROJECT_UPDATED: "project_updated",
  PROJECT_DELETED: "project_deleted",
  TASK_CREATED: "task_created",
  TASK_UPDATED: "task_updated",
  TASK_DELETED: "task_deleted",
  TASK_ASSIGNED: "task_assigned",
  TASK_STATUS_CHANGED: "task_status_changed",
  COMMENT_ADDED: "comment_added",
  COMMENT_UPDATED: "comment_updated",
  COMMENT_DELETED: "comment_deleted",
  USER_JOINED: "user_joined",
  USER_LEFT: "user_left",
} as const;

// Priority Colors (for UI)
export const PRIORITY_COLORS = {
  low: "#10B981", // green
  medium: "#F59E0B", // yellow
  high: "#EF4444", // red
  urgent: "#DC2626", // dark red
} as const;

// Status Colors (for UI)
export const STATUS_COLORS = {
  // Task statuses
  todo: "#6B7280", // gray
  in_progress: "#3B82F6", // blue
  in_review: "#8B5CF6", // purple
  done: "#10B981", // green

  // Project statuses
  active: "#10B981", // green
  completed: "#6B7280", // gray
  on_hold: "#F59E0B", // yellow
  cancelled: "#EF4444", // red
} as const;

// Export all constants
export const CONSTANTS = {
  API_CONFIG,
  HTTP_STATUS,
  USER_ROLES,
  TASK_STATUSES,
  TASK_PRIORITIES,
  PROJECT_STATUSES,
  THEMES,
  STORAGE_KEYS,
  TOAST_CONFIG,
  VALIDATION_RULES,
  PAGINATION,
  FILE_UPLOAD,
  DATE_FORMATS,
  BREAKPOINTS,
  ANIMATION_DURATION,
  Z_INDEX,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  QUERY_KEYS,
  ACTIVITY_TYPES,
  PRIORITY_COLORS,
  STATUS_COLORS,
} as const;

