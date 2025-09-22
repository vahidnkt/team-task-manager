import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config";
import type { RootState } from "../index";
import { HttpStatus } from "../../types";

// Base API configuration
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const state = getState() as RootState;
      const token = (state.auth as any)?.token;

      // If we have a token, set the authorization header
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      // Set content type
      headers.set("content-type", "application/json");

      return headers;
    },
  }),
  tagTypes: ["User", "Project", "Task", "Comment", "Activity"],
  endpoints: () => ({}),
});

// Global error handler
export const handleApiError = (error: any, { dispatch }: any) => {
  console.error("API Error:", error);

  // Extract error message from backend response
  let errorMessage = "An error occurred";

  if (error?.data?.message) {
    errorMessage = error.data.message;
  } else if (error?.data?.error) {
    errorMessage = error.data.error;
  } else if (error?.message) {
    errorMessage = error.message;
  }

  if (error.status === HttpStatus.UNAUTHORIZED) {
    // Auto logout on 401
    dispatch({ type: "auth/logout" });
    dispatch({
      type: "ui/addToast",
      payload: {
        id: Date.now().toString(),
        type: "error",
        message: errorMessage || "Session expired. Please login again.",
        duration: 5000,
      },
    });
  } else if (error.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
    // Show global toast for 500+ errors
    dispatch({
      type: "ui/addToast",
      payload: {
        id: Date.now().toString(),
        type: "error",
        message: errorMessage || "Server error. Please try again later.",
        duration: 5000,
      },
    });
  } else if (error.status === HttpStatus.NOT_FOUND) {
    dispatch({
      type: "ui/addToast",
      payload: {
        id: Date.now().toString(),
        type: "error",
        message: errorMessage || "Resource not found.",
        duration: 3000,
      },
    });
  } else if (error.status === HttpStatus.FORBIDDEN) {
    dispatch({
      type: "ui/addToast",
      payload: {
        id: Date.now().toString(),
        type: "error",
        message:
          errorMessage || "You do not have permission to perform this action.",
        duration: 4000,
      },
    });
  } else {
    // Generic error handling
    dispatch({
      type: "ui/addToast",
      payload: {
        id: Date.now().toString(),
        type: "error",
        message: errorMessage,
        duration: 4000,
      },
    });
  }
};
