import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "../../config/api";
import type { User } from "../../types";

// Users API slice
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users (admin only)
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: API_ENDPOINTS.USERS.BASE,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: ["User"],
    }),

    // Get user by ID
    getUser: builder.query<User, string>({
      query: (id) => ({
        url: API_ENDPOINTS.USERS.BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    // Update user
    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
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
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.USERS.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
