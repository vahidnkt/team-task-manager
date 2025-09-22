import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../store";
import {
  loginSuccess,
  logout,
  updateUser,
  setLoading,
  setError,
  clearError,
} from "../store/authSlice";
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
} from "../store/api/authApi";
import { useToast } from "./useToast";
import { ROUTES } from "../router";

// Authentication hook
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showSuccess, showError, handleApiError } = useToast();

  // Select auth state
  const auth = useSelector((state: RootState) => state.auth);
  const { user, token, isAuthenticated, isLoading, error } = auth;

  // API mutations
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] =
    useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();

  // Get profile query (only when authenticated)
  const { data: profile, refetch: refetchProfile } = useGetProfileQuery(
    undefined,
    {
      skip: !isAuthenticated || !token,
    }
  );

  // Auto logout when token expires (7 days)
  useEffect(() => {
    if (token && isAuthenticated) {
      try {
        // Decode JWT token to check expiration
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;

        if (timeUntilExpiry > 0) {
          // Set timeout to auto-logout when token expires
          const timeoutId = setTimeout(() => {
            dispatch(logout());
            showError("Session expired. Please login again.");
            navigate(ROUTES.LOGIN, { replace: true });
          }, timeUntilExpiry);

          return () => clearTimeout(timeoutId);
        } else {
          // Token already expired
          dispatch(logout());
          navigate(ROUTES.LOGIN, { replace: true });
        }
      } catch (error) {
        // Invalid token format, logout immediately
        dispatch(logout());
        navigate(ROUTES.LOGIN, { replace: true });
      }
    }
  }, [token, isAuthenticated, dispatch, navigate, showError]);

  // Login function
  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await loginMutation(credentials).unwrap();

        // Handle successful login
        dispatch(
          loginSuccess({
            user: response.user,
            token: response.token, // Single JWT token with 7-day expiry
          })
        );

        showSuccess("Login successful");
        return { success: true, data: response };
      } catch (error: any) {
        const errorMessage =
          error?.data?.message || error?.message || "Login failed";
        dispatch(setError(errorMessage));
        handleApiError(error, "Login failed");
        return { success: false, error: errorMessage };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, loginMutation, showSuccess, handleApiError]
  );

  // Register function
  const register = useCallback(
    async (userData: { username: string; email: string; password: string }) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await registerMutation(userData).unwrap();

        // Registration successful - redirect to login
        showSuccess(
          "Registration successful! Please login with your credentials."
        );
        return { success: true, data: response };
      } catch (error: any) {
        const errorMessage =
          error?.data?.message || error?.message || "Registration failed";
        dispatch(setError(errorMessage));
        handleApiError(error, "Registration failed");
        return { success: false, error: errorMessage };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, registerMutation, showSuccess, handleApiError]
  );

  // Logout function
  const logoutUser = useCallback(async () => {
    try {
      if (token) {
        await logoutMutation().unwrap();
      }
    } catch (error) {
      // Even if logout API fails, we should still clear local state
      console.warn("Logout API call failed:", error);
    } finally {
      dispatch(logout());
      navigate(ROUTES.LOGIN, { replace: true });
      showSuccess("Logged out successfully");
    }
  }, [dispatch, logoutMutation, token, showSuccess, navigate]);

  // Update user profile
  const updateUserProfile = useCallback(
    (userData: any) => {
      dispatch(updateUser(userData));
    },
    [dispatch]
  );

  // Refresh user profile
  const refreshUserProfile = useCallback(async () => {
    try {
      await refetchProfile();
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    }
  }, [refetchProfile]);

  // Check if user has specific role
  const hasRole = useCallback(
    (role: string) => {
      return user?.role === role;
    },
    [user?.role]
  );

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return hasRole("admin");
  }, [hasRole]);

  // Check if user is regular user
  const isUser = useCallback(() => {
    return hasRole("user");
  }, [hasRole]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || isLoginLoading || isRegisterLoading,
    error,
    profile,

    // Actions
    login,
    register,
    logout: logoutUser,
    updateUser: updateUserProfile,
    refreshProfile: refreshUserProfile,

    // Utilities
    hasRole,
    isAdmin,
    isUser,

    // Clear error
    clearError: () => dispatch(clearError()),
  };
};
