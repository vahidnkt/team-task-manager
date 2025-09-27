import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config";
import type { RootState } from "../index";

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
  tagTypes: ["User", "Project", "Task", "Comment", "Activity", "ActivityStats"],
  endpoints: () => ({}),
});

// Error logger for debugging
export const logApiError = (error: any) => {
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

  return errorMessage;
};
