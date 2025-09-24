// API Endpoints Configuration
// Clean separation of API routes from other configuration

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    UPDATE_PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // User endpoints
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },

  // Project endpoints
  PROJECTS: {
    BASE: "/projects",
    BY_ID: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
    MEMBERS: (id: string) => `/projects/${id}/members`,
    ADD_MEMBER: (id: string) => `/projects/${id}/members`,
    REMOVE_MEMBER: (id: string, userId: string) =>
      `/projects/${id}/members/${userId}`,
  },

  // Task endpoints
  TASKS: {
    BASE: "/tasks",
    BY_ID: (id: string) => `/tasks/${id}`,
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
    ASSIGN: (id: string) => `/tasks/${id}/assign`,
    STATUS: (id: string) => `/tasks/${id}/status`,
    COMMENTS: (id: string) => `/tasks/${id}/comments`,
  },

  // Comment endpoints
  COMMENTS: {
    BASE: "/comments",
    BY_ID: (id: string) => `/comments/${id}`,
    UPDATE: (id: string) => `/comments/${id}`,
    DELETE: (id: string) => `/comments/${id}`,
  },

  // Activity endpoints
  ACTIVITIES: {
    BASE: "/activities",
    BY_ID: (id: string) => `/activities/${id}`,
    BY_PROJECT: (projectId: string) => `/activities/project/${projectId}`,
    BY_TASK: (taskId: string) => `/activities/task/${taskId}`,
    BY_USER: (userId: string) => `/activities/user/${userId}`,
  },

  // Dashboard endpoints
  DASHBOARD: {
    BASE: "/dashboard",
    STATS: "/dashboard/stats",
    RECENT_TASKS: "/dashboard/recent-tasks",
    RECENT_ACTIVITIES: "/dashboard/recent-activities",
    PROJECTS: "/dashboard/projects",
    ACTIVITY_SUMMARY: "/dashboard/activity-summary",
  },
} as const;
