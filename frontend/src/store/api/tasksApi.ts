import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "../../config/api";
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskWithDetails,
  GetTasksQuery,
  TasksResponse,
  AssignTaskRequest,
  UpdateTaskStatusRequest,
} from "../../types";

// Tasks API slice
export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tasks with search, filter, and pagination
    getTasks: builder.query<TasksResponse, GetTasksQuery>({
      query: (params = {}) => ({
        url: API_ENDPOINTS.TASKS.BASE,
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: ["Task"],
    }),

    // Get user's tasks (tasks assigned to current user)
    getMyTasks: builder.query<TasksResponse, GetTasksQuery>({
      query: (params = {}) => ({
        url: `${API_ENDPOINTS.TASKS.BASE}/my`,
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: ["Task"],
    }),

    // Get task by ID
    getTask: builder.query<TaskWithDetails, string>({
      query: (id) => ({
        url: API_ENDPOINTS.TASKS.BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),

    // Create task in project
    createTask: builder.mutation<
      Task,
      { projectId: string; data: CreateTaskRequest }
    >({
      query: ({ projectId, data }) => ({
        url: `${API_ENDPOINTS.TASKS.BASE}/projects/${projectId}/tasks`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
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
        transformResponse: (response: any) => {
          return response.data || response;
        },
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
    updateTaskStatus: builder.mutation<
      Task,
      { id: string; data: UpdateTaskStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.TASKS.STATUS(id),
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Task", id },
        "Task",
        "Project",
      ],
    }),

    // Assign task
    assignTask: builder.mutation<Task, { id: string; data: AssignTaskRequest }>(
      {
        query: ({ id, data }) => ({
          url: API_ENDPOINTS.TASKS.ASSIGN(id),
          method: "PATCH",
          body: data,
        }),
        transformResponse: (response: any) => {
          return response.data || response;
        },
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Task", id },
          "Task",
          "User",
        ],
      }
    ),

    // Get task comments
    getTaskComments: builder.query<any[], string>({
      query: (taskId) => ({
        url: API_ENDPOINTS.TASKS.COMMENTS(taskId),
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: (_result, _error, taskId) => [
        { type: "Comment", id: taskId },
        "Comment",
      ],
    }),

    // Get tasks by project
    getTasksByProject: builder.query<Task[], string>({
      query: (projectId) => ({
        url: API_ENDPOINTS.PROJECTS.TASKS(projectId),
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: (_result, _error, projectId) => [
        { type: "Project", id: projectId },
        "Task",
      ],
    }),

    // Get tasks by status in project
    getTasksByStatus: builder.query<
      Task[],
      { projectId: string; status: string }
    >({
      query: ({ projectId, status }) => ({
        url: API_ENDPOINTS.PROJECTS.TASKS_BY_STATUS(projectId),
        method: "GET",
        params: { status },
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: (_result, _error, { projectId }) => [
        { type: "Project", id: projectId },
        "Task",
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetTasksQuery,
  useGetMyTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
  useAssignTaskMutation,
  useGetTaskCommentsQuery,
  useGetTasksByProjectQuery,
  useGetTasksByStatusQuery,
} = tasksApi;
