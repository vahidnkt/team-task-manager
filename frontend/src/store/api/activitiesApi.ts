import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "../../config/api";
import type {
  Activity,
  ActivitySummary,
  ProjectActivityStats,
  SystemActivityStats,
  GetActivitiesQuery,
  ActivitiesResponse,
} from "../../types/activity.types";

export const activitiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get recent activities (admin only)
    getRecentActivities: builder.query<ActivitiesResponse, GetActivitiesQuery>({
      query: (params = {}) => ({
        url: API_ENDPOINTS.ACTIVITIES.RECENT,
        params: {
          limit: params.limit || 50,
          offset: params.offset || 0,
        },
      }),
      transformResponse: (response: any) => {
        return {
          activities: response.data?.activities || response.data || [],
          total: response.data?.total || 0,
          limit: response.data?.limit || 50,
          offset: response.data?.offset || 0,
        };
      },
      providesTags: ["Activity"],
    }),

    // Get user activity summary
    getUserActivitySummary: builder.query<ActivitySummary, { days?: number }>({
      query: (params = {}) => ({
        url: API_ENDPOINTS.ACTIVITIES.MY,
        params: {
          days: params.days || 7,
        },
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: ["ActivityStats"],
    }),

    // Get activities by user
    getUserActivities: builder.query<
      ActivitiesResponse,
      { userId: string } & GetActivitiesQuery
    >({
      query: ({ userId, ...params }) => ({
        url: API_ENDPOINTS.ACTIVITIES.BY_USER(userId),
        params: {
          limit: params.limit || 20,
          offset: params.offset || 0,
        },
      }),
      transformResponse: (response: any) => {
        return {
          activities: response.data?.activities || response.data || [],
          total: response.data?.total || 0,
          limit: response.data?.limit || 20,
          offset: response.data?.offset || 0,
        };
      },
      providesTags: ["Activity"],
    }),

    // Get project activities
    getProjectActivities: builder.query<
      ActivitiesResponse,
      { projectId: string } & GetActivitiesQuery
    >({
      query: ({ projectId, ...params }) => ({
        url: API_ENDPOINTS.ACTIVITIES.BY_PROJECT(projectId),
        params: {
          limit: params.limit || 20,
          offset: params.offset || 0,
        },
      }),
      transformResponse: (response: any) => {
        return {
          activities: response.data?.activities || response.data || [],
          total: response.data?.total || 0,
          limit: response.data?.limit || 20,
          offset: response.data?.offset || 0,
        };
      },
      providesTags: ["Activity"],
    }),

    // Get project activity statistics
    getProjectActivityStats: builder.query<
      ProjectActivityStats,
      { projectId: string; days?: number }
    >({
      query: ({ projectId, days = 30 }) => ({
        url: API_ENDPOINTS.ACTIVITIES.PROJECT_STATS(projectId),
        params: { days },
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: ["ActivityStats"],
    }),

    // Get task activities
    getTaskActivities: builder.query<
      ActivitiesResponse,
      { taskId: string } & GetActivitiesQuery
    >({
      query: ({ taskId, ...params }) => ({
        url: API_ENDPOINTS.ACTIVITIES.BY_TASK(taskId),
        params: {
          limit: params.limit || 20,
          offset: params.offset || 0,
        },
      }),
      transformResponse: (response: any) => {
        return {
          activities: response.data?.activities || response.data || [],
          total: response.data?.total || 0,
          limit: response.data?.limit || 20,
          offset: response.data?.offset || 0,
        };
      },
      providesTags: ["Activity"],
    }),

    // Get system activity statistics (admin only)
    getSystemActivityStats: builder.query<
      SystemActivityStats,
      { days?: number }
    >({
      query: (params = {}) => ({
        url: API_ENDPOINTS.ACTIVITIES.SYSTEM_STATS,
        params: {
          days: params.days || 30,
        },
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: ["ActivityStats"],
    }),

    // Delete activity (admin only)
    deleteActivity: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: API_ENDPOINTS.ACTIVITIES.BY_ID(id),
        method: "DELETE",
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      invalidatesTags: ["Activity", "ActivityStats"],
    }),

    // Update activity (admin only)
    updateActivity: builder.mutation<
      Activity,
      { id: string; data: { action?: string; description?: string } }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.ACTIVITIES.BY_ID(id),
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      invalidatesTags: ["Activity", "ActivityStats"],
    }),
  }),
});

export const {
  useGetRecentActivitiesQuery,
  useGetUserActivitySummaryQuery,
  useGetUserActivitiesQuery,
  useGetProjectActivitiesQuery,
  useGetProjectActivityStatsQuery,
  useGetTaskActivitiesQuery,
  useGetSystemActivityStatsQuery,
  useDeleteActivityMutation,
  useUpdateActivityMutation,
} = activitiesApi;
