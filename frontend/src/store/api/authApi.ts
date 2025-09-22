import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "../../config/api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../../types";

// Auth API slice
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // Register
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // Note: No refresh token functionality - JWT expires after 7 days

    // Get current user profile
    getProfile: builder.query<User, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.PROFILE,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Update profile
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (profileData) => ({
        url: API_ENDPOINTS.AUTH.UPDATE_PROFILE,
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["User"],
    }),

    // Change password
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        method: "PUT",
        body: passwordData,
      }),
    }),

    // Forgot password
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (emailData) => ({
        url: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        method: "POST",
        body: emailData,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: (resetData) => ({
        url: API_ENDPOINTS.AUTH.RESET_PASSWORD,
        method: "POST",
        body: resetData,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
