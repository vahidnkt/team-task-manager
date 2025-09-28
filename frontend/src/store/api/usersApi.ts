import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "../../config/api";
import type {
  UserWithoutPassword,
  CreateUserRequest,
  UpdateProfileRequest,
  GetAllUsersQuery,
} from "../../types";

// Users API slice
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with query parameters (admin only)
    getUsers: builder.query<
      { users: UserWithoutPassword[]; total: number },
      GetAllUsersQuery
    >({
      query: (params) => ({
        url: API_ENDPOINTS.USERS.BASE,
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => {
        return {
          users: response.data?.users || response.users || [],
          total: response.data?.total || response.total || 0,
        };
      },
      providesTags: ["User"],
    }),

    // Get user by ID
    getUser: builder.query<UserWithoutPassword, string>({
      query: (id) => ({
        url: API_ENDPOINTS.USERS.BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    // Get current user profile
    getCurrentUser: builder.query<UserWithoutPassword, void>({
      query: () => ({
        url: `${API_ENDPOINTS.USERS.BASE}/profile`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: ["User"],
    }),

    // Create user (admin only)
    createUser: builder.mutation<UserWithoutPassword, CreateUserRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.USERS.BASE,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      invalidatesTags: ["User"],
    }),

    // Update user
    updateUser: builder.mutation<
      UserWithoutPassword,
      { id: string; data: UpdateProfileRequest }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.USERS.UPDATE(id),
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        "User",
      ],
    }),

    // Delete user (admin only)
    deleteUser: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (id) => ({
          url: API_ENDPOINTS.USERS.DELETE(id),
          method: "DELETE",
        }),
        transformResponse: (response: any) => {
          // Handle successful deletion response
          if (response?.success) {
            return {
              success: true,
              message: response.message || "User deleted successfully",
            };
          }
          return {
            success: true,
            message: "User deleted successfully",
          };
        },
        transformErrorResponse: (response: any) => {
          // Handle error response
          const errorMessage =
            response?.data?.message ||
            response?.data?.error ||
            response?.message ||
            "Failed to delete user";
          return {
            success: false,
            message: errorMessage,
          };
        },
        invalidatesTags: (_result, _error, id) => [
          { type: "User", id },
          "User",
        ],
      }
    ),
  }),
});

// Export hooks for usage in components
export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetCurrentUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
