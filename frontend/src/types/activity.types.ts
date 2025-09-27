// Activity Types
export interface Activity {
  id: string;
  projectId: string;
  taskId?: string;
  userId: string;
  action: string;
  description?: string;
  createdAt: string;
  // Relations
  user?: {
    id: string;
    username: string;
    email: string;
  };
  project?: {
    id: string;
    name: string;
    status?: "active" | "completed" | "on_hold";
  };
  task?: {
    id: string;
    title: string;
    status: "todo" | "in-progress" | "done";
  };
}

export interface ActivitySummary {
  user_id: string;
  period_days: number;
  total_activities: number;
  actions_summary: Record<string, number>;
  daily_activities: Record<string, number>;
}

export interface ProjectActivityStats {
  project_id: string;
  period_days: number;
  total_activities: number;
  actions_summary: Record<string, number>;
  daily_activities: Record<string, number>;
  most_active_users: Array<{
    username: string;
    activity_count: number;
  }>;
}

export interface SystemActivityStats {
  period_days: number;
  total_activities: number;
  actions_summary: Record<string, number>;
  daily_activities: Record<string, number>;
  most_active_users: Array<{
    username: string;
    activity_count: number;
  }>;
  most_active_projects: Array<{
    project_name: string;
    activity_count: number;
  }>;
}

// Query parameters for getting activities
export interface GetActivitiesQuery {
  limit?: number;
  offset?: number;
  days?: number;
}

// Response from activities API
export interface ActivitiesResponse {
  activities: Activity[];
  total: number;
  limit: number;
  offset: number;
}

// Activity action types for better type safety
export type ActivityAction =
  | "task_created"
  | "task_updated"
  | "task_deleted"
  | "status_changed"
  | "task_assigned"
  | "task_unassigned"
  | "comment_added"
  | "project_created"
  | "project_updated"
  | "project_completed"
  | "project_deleted";

// Activity filter options
export interface ActivityFilter {
  action?: ActivityAction;
  project_id?: string;
  task_id?: string;
  user_id?: string;
  days?: number;
  limit?: number;
  offset?: number;
}
