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
        return response.data || response;
      },
      providesTags: ["Activity", "Task", "Project", "User"],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetDashboardQuery } = dashboardApi;
