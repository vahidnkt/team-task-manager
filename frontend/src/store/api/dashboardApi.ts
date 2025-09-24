import { baseApi } from "./baseApi";
import type {
  DashboardData,
  DashboardStats,
  DashboardRecentTask,
  DashboardRecentActivity,
  DashboardProject,
  DashboardDataQuery,
  DashboardStatsQuery,
  DashboardRecentQuery,
  DashboardProjectsQuery,
} from "../../types";

// Dashboard API endpoints
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get complete dashboard data
    getDashboardData: builder.query<DashboardData, DashboardDataQuery>({
      query: (params = {}) => ({
        url: "/dashboard",
        params,
      }),
      transformResponse: (response: any) => {
        // Extract data from the server's ApiResponse wrapper
        return response.data || response;
      },
      providesTags: ["Activity", "Task", "Project", "User"],
    }),

    // Get dashboard statistics only
    getDashboardStats: builder.query<DashboardStats, DashboardStatsQuery>({
      query: (params = {}) => ({
        url: "/dashboard/stats",
        params,
      }),
      transformResponse: (response: any) => {
        // Extract data from the server's ApiResponse wrapper
        return response.data || response;
      },
      providesTags: ["Activity", "Task", "Project", "User"],
    }),

    // Get recent tasks
    getRecentTasks: builder.query<DashboardRecentTask[], DashboardRecentQuery>({
      query: (params = {}) => ({
        url: "/dashboard/recent-tasks",
        params,
      }),
      transformResponse: (response: any) => {
        // Extract data from the server's ApiResponse wrapper
        const data = response.data || response;
        return Array.isArray(data) ? data : [];
      },
      providesTags: ["Task"],
    }),

    // Get recent activities
    getRecentActivities: builder.query<
      DashboardRecentActivity[],
      DashboardRecentQuery
    >({
      query: (params = {}) => ({
        url: "/dashboard/recent-activities",
        params,
      }),
      transformResponse: (response: any) => {
        // Extract data from the server's ApiResponse wrapper
        const data = response.data || response;
        return Array.isArray(data) ? data : [];
      },
      providesTags: ["Activity"],
    }),

    // Get projects overview
    getProjects: builder.query<DashboardProject[], DashboardProjectsQuery>({
      query: (params = {}) => ({
        url: "/dashboard/projects",
        params,
      }),
      transformResponse: (response: any) => {
        // Extract data from the server's ApiResponse wrapper
        const data = response.data || response;
        return Array.isArray(data) ? data : [];
      },
      providesTags: ["Project"],
    }),

    // Get user activity summary
    getUserActivitySummary: builder.query<any, DashboardStatsQuery>({
      query: (params = {}) => ({
        url: "/dashboard/activity-summary",
        params,
      }),
      providesTags: ["Activity"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetDashboardDataQuery,
  useGetDashboardStatsQuery,
  useGetRecentTasksQuery,
  useGetRecentActivitiesQuery,
  useGetProjectsQuery,
  useGetUserActivitySummaryQuery,
} = dashboardApi;
