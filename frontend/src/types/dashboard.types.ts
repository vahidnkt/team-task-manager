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

// Dashboard metadata from new API
export interface DashboardMetadata {
  generatedAt: string;
  userRole: string;
  dataRange: {
    statsDays: number;
    recentTasksCount: number;
    recentActivitiesCount: number;
    projectsCount: number;
  };
}

// Complete dashboard data from new single API
export interface DashboardData {
  stats: DashboardStats;
  recentTasks: DashboardRecentTask[];
  recentActivities: DashboardRecentActivity[];
  projects: DashboardProject[];
  metadata: DashboardMetadata;
}

// New single dashboard query parameters
export interface DashboardQuery {
  // Stats configuration
  statsDays?: number;

  // Recent tasks configuration
  recentTasksLimit?: number;
  recentTasksOffset?: number;

  // Recent activities configuration
  recentActivitiesLimit?: number;
  recentActivitiesOffset?: number;

  // Projects configuration
  projectsLimit?: number;
  projectsOffset?: number;
  projectsStatus?: "active" | "completed" | "all";

  // Data inclusion flags (optional - for future flexibility)
  includeStats?: boolean;
  includeRecentTasks?: boolean;
  includeRecentActivities?: boolean;
  includeProjects?: boolean;
}
