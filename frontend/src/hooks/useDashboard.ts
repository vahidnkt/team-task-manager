import { useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";
import { useGetDashboardDataQuery } from "../store/api/dashboardApi";

interface UseDashboardOptions {
  autoFetch?: boolean;
  refetchInterval?: number;
}

export const useDashboard = (options: UseDashboardOptions = {}) => {
  const { autoFetch = true, refetchInterval } = options;
  const { user, isAuthenticated } = useAuth();
  const { showError } = useToast();

  // Single optimized RTK Query hook - fetches all dashboard data in one call
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useGetDashboardDataQuery(
    {},
    {
      skip: !isAuthenticated || !user || !autoFetch,
      pollingInterval: refetchInterval,
    }
  );

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      const errorMessage =
        (error as any)?.data?.message ||
        (error as any)?.message ||
        "Failed to fetch dashboard data";
      showError(errorMessage);
    }
  }, [error, showError]);

  // Refresh function
  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Extract data from the single API response
  const stats = dashboardData?.stats || null;
  const recentTasks = Array.isArray(dashboardData?.recentTasks)
    ? dashboardData.recentTasks
    : [];
  const recentActivities = Array.isArray(dashboardData?.recentActivities)
    ? dashboardData.recentActivities
    : [];
  const projects = Array.isArray(dashboardData?.projects)
    ? dashboardData.projects
    : [];

  return {
    // Main data
    dashboardData,
    isLoading,
    error,
    refresh,

    // Extracted data for easy access
    stats,
    recentTasks,
    recentActivities,
    projects,

    // Individual refresh functions (for backward compatibility)
    refreshStats: refresh,
    refreshRecentTasks: refresh,
    refreshRecentActivities: refresh,
    refreshProjects: refresh,
  };
};
