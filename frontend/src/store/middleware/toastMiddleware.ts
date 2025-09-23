import { isRejectedWithValue, isFulfilled } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import type { AnyAction } from "@reduxjs/toolkit";

// Define which endpoints should show success messages
const SUCCESS_MESSAGE_ENDPOINTS = {
  // Auth
  login: "Login successful!",
  register: "Account created successfully!",
  logout: "Logged out successfully",
  updateProfile: "Profile updated successfully",
  changePassword: "Password changed successfully",

  // Projects
  createProject: "Project created successfully!",
  updateProject: "Project updated successfully!",
  deleteProject: "Project deleted successfully!",

  // Tasks
  createTask: "Task created successfully!",
  updateTask: "Task updated successfully!",
  deleteTask: "Task deleted successfully!",

  // Users
  createUser: "User created successfully!",
  updateUser: "User updated successfully!",
  deleteUser: "User deleted successfully!",

  // Comments
  createComment: "Comment added successfully!",
  updateComment: "Comment updated successfully!",
  deleteComment: "Comment deleted successfully!",
};

// Define which endpoints should show error messages (most should)
const SILENT_ENDPOINTS = new Set([
  "getProfile", // Don't show error for profile queries
  "getTasks",   // Don't show error for data fetching
  "getProjects",
  "getUsers",
  "getComments",
  "getActivities",
]);

// Toast event dispatcher
const dispatchToast = (type: 'success' | 'error', message: string) => {
  // Dispatch to UI slice for custom toast system
  const event = new CustomEvent('toast', {
    detail: { type, message }
  });
  window.dispatchEvent(event);
};

/**
 * RTK Query Toast Middleware
 * Automatically shows success/error messages for API mutations
 */
export const toastMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  // Handle API errors
  if (isRejectedWithValue(action)) {
    const endpointName = action.meta?.arg?.endpointName || action.type.split("/")[1];

    // Skip silent endpoints
    if (endpointName && SILENT_ENDPOINTS.has(endpointName)) {
      return next(action);
    }

    // Extract error message
    let errorMessage = "An error occurred";

    if (action.payload?.data?.message) {
      errorMessage = action.payload.data.message;
    } else if (action.payload?.data?.error) {
      errorMessage = action.payload.data.error;
    } else if (action.payload?.message) {
      errorMessage = action.payload.message;
    } else if (action.error?.message) {
      errorMessage = action.error.message;
    }

    // Show error toast
    dispatchToast('error', errorMessage);

    // Handle specific error codes
    if (action.payload?.status === 401) {
      // Don't show additional message for 401, handled by auth logic
      return next(action);
    }
  }

  // Handle API success for mutations
  if (isFulfilled(action)) {
    const endpointName = action.meta?.arg?.endpointName || action.type.split("/")[1];

    // Only show success messages for mutations, not queries
    if (endpointName && SUCCESS_MESSAGE_ENDPOINTS[endpointName as keyof typeof SUCCESS_MESSAGE_ENDPOINTS]) {
      const successMessage = SUCCESS_MESSAGE_ENDPOINTS[endpointName as keyof typeof SUCCESS_MESSAGE_ENDPOINTS];

      // Extract custom message from response if available
      const responseMessage = action.payload?.message;
      const finalMessage = responseMessage || successMessage;

      dispatchToast('success', finalMessage);
    }
  }

  return next(action);
};

// Helper function to add custom success message for specific operations
export const showCustomSuccess = (messageText: string) => {
  dispatchToast('success', messageText);
};

// Helper function to add custom error message for specific operations
export const showCustomError = (errorMsg: string) => {
  dispatchToast('error', errorMsg);
};