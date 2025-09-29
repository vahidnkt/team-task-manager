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
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: (_result, _error, id) => [{ type: "Comment", id }],
    }),

    // Create comment for task
    createComment: builder.mutation<Comment, CreateCommentRequest>({
      query: ({ taskId, ...commentData }) => ({
        url: API_ENDPOINTS.COMMENTS.CREATE_FOR_TASK(taskId),
        method: "POST",
        body: commentData,
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
        "Comment",
      ],
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
      transformResponse: (response: any) => {
        return response.data || response;
      },
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
      invalidatesTags: (_result, _error, id) => [
        { type: "Comment", id },
        "Comment",
        "Task",
      ],
    }),

    // Get comments by task
    getCommentsByTask: builder.query<Comment[], string>({
      query: (taskId) => ({
        url: API_ENDPOINTS.COMMENTS.BY_TASK(taskId),
        method: "GET",
      }),
      transformResponse: (response: any) => {
        console.log("Raw comments API response:", response);

        // Handle the nested structure: response.data.comments (from your API response)
        if (response?.data?.comments && Array.isArray(response.data.comments)) {
          console.log(
            "Extracted comments from data.comments:",
            response.data.comments
          );
          return response.data.comments;
        }

        // Handle direct data array
        if (response?.data && Array.isArray(response.data)) {
          console.log("Extracted comments from data array:", response.data);
          return response.data;
        }

        // Fallback for direct response array
        if (Array.isArray(response)) {
          console.log("Using direct response array:", response);
          return response;
        }

        console.log("No valid comments found, returning empty array");
        return [];
      },
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
