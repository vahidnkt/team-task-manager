// Dashboard Types
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalUsers?: number; // Admin only
  activeUsers?: number; // Admin only
}

export interface DashboardRecentTask {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  projectId: string;
  projectName: string;
  assigneeId?: string;
  assigneeName?: string;
  createdAt: string;
}

export interface DashboardRecentActivity {
  id: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskTitle?: string;
  createdAt: string;
}

export interface DashboardProject {
  id: string;
  name: string;
  description?: string;
  taskCount: number;
  completedTaskCount: number;
  progressPercentage: number;
  createdBy: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentTasks: DashboardRecentTask[];
  recentActivities: DashboardRecentActivity[];
  projects: DashboardProject[];
}

// Dashboard API Query Parameters
export interface DashboardStatsQuery {
  days?: number;
}

export interface DashboardRecentQuery {
  limit?: number;
  offset?: number;
}

export interface DashboardProjectsQuery {
  limit?: number;
  offset?: number;
  status?: string;
}

export interface DashboardDataQuery {
  statsDays?: number;
  recentLimit?: number;
  recentOffset?: number;
  projectsLimit?: number;
  projectsOffset?: number;
}
