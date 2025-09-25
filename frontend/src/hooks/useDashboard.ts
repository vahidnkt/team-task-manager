import { useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";
import { useGetDashboardQuery } from "../store/api/dashboardApi";

interface UseDashboardOptions {
  autoFetch?: boolean;
  refetchInterval?: number;
  // Optional query parameters for the single API
  statsDays?: number;
  recentTasksLimit?: number;
  recentTasksOffset?: number;
  recentActivitiesLimit?: number;
  recentActivitiesOffset?: number;
  projectsLimit?: number;
  projectsOffset?: number;
  projectsStatus?: "active" | "completed" | "all";
  includeStats?: boolean;
  includeRecentTasks?: boolean;
  includeRecentActivities?: boolean;
  includeProjects?: boolean;
}

export const useDashboard = (options: UseDashboardOptions = {}) => {
  const {
    autoFetch = true,
    refetchInterval,
    statsDays = 30,
    recentTasksLimit = 10,
    recentTasksOffset = 0,
    recentActivitiesLimit = 10,
    recentActivitiesOffset = 0,
    projectsLimit = 20,
    projectsOffset = 0,
    projectsStatus = "all",
    includeStats = true,
    includeRecentTasks = true,
    includeRecentActivities = true,
    includeProjects = true,
  } = options;

  const { user, isAuthenticated } = useAuth();
  const { showError } = useToast();

  // Single optimized RTK Query hook - fetches all dashboard data in one call
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useGetDashboardQuery(
    {
      statsDays,
      recentTasksLimit,
      recentTasksOffset,
      recentActivitiesLimit,
      recentActivitiesOffset,
      projectsLimit,
      projectsOffset,
      projectsStatus,
      includeStats,
      includeRecentTasks,
      includeRecentActivities,
      includeProjects,
    },
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

  // Extract data from the single API response with proper fallbacks
  const stats = dashboardData?.stats || {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalUsers: 0,
    activeUsers: 0,
  };
  
  const recentTasks = Array.isArray(dashboardData?.recentTasks)
    ? dashboardData.recentTasks
    : [];
    
  const recentActivities = Array.isArray(dashboardData?.recentActivities)
    ? dashboardData.recentActivities
    : [];
    
  const projects = Array.isArray(dashboardData?.projects)
    ? dashboardData.projects
    : [];
    
  const metadata = dashboardData?.metadata || {
    generatedAt: new Date().toISOString(),
    userRole: "user",
    dataRange: {
      statsDays: 30,
      recentTasksCount: 0,
      recentActivitiesCount: 0,
      projectsCount: 0,
    },
  };

  return {
    // Main data
    dashboardData,
    isLoading,
    error,
    refresh,
    metadata,

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
