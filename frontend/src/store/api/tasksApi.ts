import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "../../config/api";
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskWithDetails,
  TaskFilter,
} from "../../types";

// Tasks API slice
export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tasks with filtering
    getTasks: builder.query<Task[], TaskFilter>({
      query: (filters = {}) => ({
        url: API_ENDPOINTS.TASKS.BASE,
        method: "GET",
        params: filters,
      }),
      providesTags: ["Task"],
    }),

    // Get task by ID
    getTask: builder.query<TaskWithDetails, string>({
      query: (id) => ({
        url: API_ENDPOINTS.TASKS.BY_ID(id),
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),

    // Create task
    createTask: builder.mutation<Task, CreateTaskRequest>({
      query: (taskData) => ({
        url: API_ENDPOINTS.TASKS.BASE,
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: ["Task", "Project"],
    }),

    // Update task
    updateTask: builder.mutation<Task, { id: string; data: UpdateTaskRequest }>(
      {
        query: ({ id, data }) => ({
          url: API_ENDPOINTS.TASKS.UPDATE(id),
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Task", id },
          "Task",
          "Project",
        ],
      }
    ),

    // Delete task
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.TASKS.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Task", "Project"],
    }),

    // Update task status
    updateTaskStatus: builder.mutation<Task, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: API_ENDPOINTS.TASKS.STATUS(id),
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Task", id },
        "Task",
        "Project",
      ],
    }),

    // Assign task
    assignTask: builder.mutation<Task, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: API_ENDPOINTS.TASKS.ASSIGN(id),
        method: "PATCH",
        body: { userId },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Task", id },
        "Task",
        "User",
      ],
    }),

    // Get task comments
    getTaskComments: builder.query<any[], string>({
      query: (taskId) => ({
        url: API_ENDPOINTS.TASKS.COMMENTS(taskId),
        method: "GET",
      }),
      providesTags: (_result, _error, taskId) => [
        { type: "Comment", id: taskId },
        "Comment",
      ],
    }),

    // Get tasks by project
    getTasksByProject: builder.query<Task[], string>({
      query: (projectId) => ({
        url: API_ENDPOINTS.TASKS.BASE,
        method: "GET",
        params: { projectId },
      }),
      providesTags: (_result, _error, projectId) => [
        { type: "Project", id: projectId },
        "Task",
      ],
    }),

    // Get tasks by user
    getTasksByUser: builder.query<Task[], string>({
      query: (userId) => ({
        url: API_ENDPOINTS.TASKS.BASE,
        method: "GET",
        params: { assignedTo: userId },
      }),
      providesTags: (_result, _error, userId) => [
        { type: "User", id: userId },
        "Task",
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
  useAssignTaskMutation,
  useGetTaskCommentsQuery,
  useGetTasksByProjectQuery,
  useGetTasksByUserQuery,
} = tasksApi;
