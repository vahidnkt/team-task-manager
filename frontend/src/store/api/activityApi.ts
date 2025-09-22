import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "../../config/api";
import type {
  Activity,
  CreateActivityRequest,
  ActivityWithDetails,
  ActivitySummary,
} from "../../types";

// Activity API slice
export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get activity by ID
    getActivity: builder.query<ActivityWithDetails, string>({
      query: (id) => ({
        url: API_ENDPOINTS.ACTIVITIES.BY_ID(id),
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Activity", id }],
    }),

    // Get activities by project
    getActivitiesByProject: builder.query<Activity[], string>({
      query: (projectId) => ({
        url: API_ENDPOINTS.ACTIVITIES.BY_PROJECT(projectId),
        method: "GET",
      }),
      providesTags: (_result, _error, projectId) => [
        { type: "Project", id: projectId },
        "Activity",
      ],
    }),

    // Get activities by task
    getActivitiesByTask: builder.query<Activity[], string>({
      query: (taskId) => ({
        url: API_ENDPOINTS.ACTIVITIES.BY_TASK(taskId),
        method: "GET",
      }),
      providesTags: (_result, _error, taskId) => [
        { type: "Task", id: taskId },
        "Activity",
      ],
    }),

    // Get activities by user
    getActivitiesByUser: builder.query<Activity[], string>({
      query: (userId) => ({
        url: API_ENDPOINTS.ACTIVITIES.BY_USER(userId),
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [
        { type: "User", id: userId },
        "Activity",
      ],
    }),

    // Get recent activities (global)
    getRecentActivities: builder.query<Activity[], { limit?: number }>({
      query: (params = {}) => ({
        url: API_ENDPOINTS.ACTIVITIES.BASE,
        method: "GET",
        params: { ...params, recent: true },
      }),
      providesTags: ["Activity"],
    }),

    // Get activity summary for dashboard
    getActivitySummary: builder.query<
      ActivitySummary,
      {
        projectId?: string;
        userId?: string;
        days?: number;
      }
    >({
      query: (params = {}) => ({
        url: `${API_ENDPOINTS.ACTIVITIES.BASE}/summary`,
        method: "GET",
        params,
      }),
      providesTags: ["Activity"],
    }),

    // Create activity (usually done automatically by other operations)
    createActivity: builder.mutation<Activity, CreateActivityRequest>({
      query: (activityData) => ({
        url: API_ENDPOINTS.ACTIVITIES.BASE,
        method: "POST",
        body: activityData,
      }),
      invalidatesTags: ["Activity", "Project", "Task", "User"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetActivityQuery,
  useGetActivitiesByProjectQuery,
  useGetActivitiesByTaskQuery,
  useGetActivitiesByUserQuery,
  useGetRecentActivitiesQuery,
  useGetActivitySummaryQuery,
  useCreateActivityMutation,
} = activityApi;
