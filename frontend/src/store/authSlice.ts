import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserWithoutPassword, AuthState } from "../types";

// Initial state
const initialState: AuthState = {
  user: null,
  token: null, // Single JWT token with 7-day expiry
  isAuthenticated: false,
  isLoading: false,
  error: null,
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
