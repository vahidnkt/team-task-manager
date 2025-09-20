// Activity Types
export interface Activity {
  id: number;
  project_id: number;
  task_id?: number;
  user_id: number;
  action: string;
  description?: string;
  created_at: Date;
  username?: string;
  project_name?: string;
  task_title?: string;
}

export interface CreateActivityRequest {
  project_id: number;
  task_id?: number;
  user_id: number;
  action: string;
  description?: string;
}

export interface ActivityWithDetails extends Activity {
  user?: {
    id: number;
    username: string;
    email: string;
  };
  task?: {
    id: number;
    title: string;
  };
  project?: {
    id: number;
    name: string;
  };
  username?: string;
  project_name?: string;
  task_title?: string;
}

export interface ActivitySummary {
  project_id: number;
  period_days: number;
  total_activities: number;
  actions_summary: Record<string, number>;
  daily_activities: Record<string, number>;
  most_active_users: Array<{
    username: string;
    activity_count: number;
  }>;
}
