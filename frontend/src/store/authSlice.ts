import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import type { UserWithoutPassword, AuthState } from "../types";

// Initial state
const initialState: AuthState = {
  user: null,
  token: null, // Single JWT token with 7-day expiry
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Helper function to check if token is valid
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    return currentTime < expirationTime;
  } catch {
    return false;
  }
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Login success
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: UserWithoutPassword;
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    // Update user profile
    updateUser: (state, action: PayloadAction<UserWithoutPassword>) => {
      state.user = action.payload;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    // Clear auth state (for logout)
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle Redux Persist rehydration
    builder.addCase(REHYDRATE, (state, action) => {
      if (action.payload?.auth) {
        const { token, user } = action.payload.auth;

        // Check if the persisted token is still valid
        if (token && user && isTokenValid(token)) {
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
        } else {
          // Token is invalid or expired, clear the auth state
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }

        state.isLoading = false;
        state.error = null;
      }
    });
  },
});

// Export actions
export const {
  setLoading,
  setError,
  clearError,
  loginSuccess,
  updateUser,
  logout,
  clearAuth,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
