import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "../../config/api";
import type { User, CreateUserRequest, UpdateUserRequest } from "../../types";

// Users API slice (Admin only)
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users (Admin only)
    getUsers: builder.query<
      User[],
      { page?: number; limit?: number; search?: string }
    >({
      query: (params = {}) => ({
        url: API_ENDPOINTS.USERS.BASE,
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),

    // Get user by ID
    getUser: builder.query<User, string>({
      query: (id) => ({
        url: API_ENDPOINTS.USERS.BY_ID(id),
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    // Create user (Admin only)
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (userData) => ({
        url: API_ENDPOINTS.USERS.BASE,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Update user (Admin only)
    updateUser: builder.mutation<User, { id: string; data: UpdateUserRequest }>(
      {
        query: ({ id, data }) => ({
          url: API_ENDPOINTS.USERS.UPDATE(id),
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "User", id },
          "User",
        ],
      }
    ),

    // Delete user (Admin only)
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.USERS.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Get user statistics (Admin only)
    getUserStats: builder.query<
      {
        totalUsers: number;
        activeUsers: number;
        adminUsers: number;
        recentUsers: User[];
      },
      void
    >({
      query: () => ({
        url: `${API_ENDPOINTS.USERS.BASE}/stats`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Get user activity (Admin only)
    getUserActivity: builder.query<any[], string>({
      query: (userId) => ({
        url: `${API_ENDPOINTS.USERS.BY_ID(userId)}/activity`,
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [
        { type: "User", id: userId },
        "Activity",
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserStatsQuery,
  useGetUserActivityQuery,
} = usersApi;
