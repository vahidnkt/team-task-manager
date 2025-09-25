import { baseApi } from "./baseApi";
import type { DashboardData, DashboardQuery } from "../../types";

// Dashboard API endpoints - Single comprehensive endpoint
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get complete dashboard data - Single API call for all dashboard data
    getDashboard: builder.query<DashboardData, DashboardQuery>({
      query: (params = {}) => ({
        url: "/dashboard",
        params,
      }),
      transformResponse: (response: any) => {
        // Extract data from the server's ApiResponse wrapper
        const data = response.data || response;
        
        // Ensure all arrays are properly initialized
        return {
          ...data,
          recentTasks: Array.isArray(data.recentTasks) ? data.recentTasks : [],
          recentActivities: Array.isArray(data.recentActivities) ? data.recentActivities : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          stats: data.stats || {
            totalTasks: 0,
            completedTasks: 0,
            inProgressTasks: 0,
            overdueTasks: 0,
            totalProjects: 0,
            activeProjects: 0,
            completedProjects: 0,
            totalUsers: 0,
            activeUsers: 0,
          },
          metadata: data.metadata || {
            generatedAt: new Date().toISOString(),
            userRole: "user",
            dataRange: {
              statsDays: 30,
              recentTasksCount: 0,
              recentActivitiesCount: 0,
              projectsCount: 0,
            },
          },
        };
      },
      providesTags: ["Activity", "Task", "Project", "User"],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetDashboardQuery } = dashboardApi;
