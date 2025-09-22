import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "../../config/api";
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../../types";

// Comments API slice
export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get comment by ID
    getComment: builder.query<Comment, string>({
      query: (id) => ({
        url: API_ENDPOINTS.COMMENTS.BY_ID(id),
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Comment", id }],
    }),

    // Create comment
    createComment: builder.mutation<Comment, CreateCommentRequest>({
      query: (commentData) => ({
        url: API_ENDPOINTS.COMMENTS.BASE,
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: ["Comment", "Task"],
    }),

    // Update comment
    updateComment: builder.mutation<
      Comment,
      { id: string; data: UpdateCommentRequest }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.COMMENTS.UPDATE(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Comment", id },
        "Comment",
        "Task",
      ],
    }),

    // Delete comment
    deleteComment: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.COMMENTS.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Comment", "Task"],
    }),

    // Get comments by task
    getCommentsByTask: builder.query<Comment[], string>({
      query: (taskId) => ({
        url: API_ENDPOINTS.TASKS.COMMENTS(taskId),
        method: "GET",
      }),
      providesTags: (_result, _error, taskId) => [
        { type: "Task", id: taskId },
        "Comment",
      ],
    }),

    // Get comments by user
    getCommentsByUser: builder.query<Comment[], string>({
      query: (userId) => ({
        url: API_ENDPOINTS.COMMENTS.BASE,
        method: "GET",
        params: { userId },
      }),
      providesTags: (_result, _error, userId) => [
        { type: "User", id: userId },
        "Comment",
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetCommentQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsByTaskQuery,
  useGetCommentsByUserQuery,
} = commentsApi;
