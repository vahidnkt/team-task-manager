// Activity Types
export interface Activity {
  id: string;
  project_id: string;
  task_id?: string;
  user_id: string;
  action: string;
  description?: string;
  created_at: Date;
  username?: string;
  project_name?: string;
  task_title?: string;
}

export interface CreateActivityRequest {
  project_id: string;
  task_id?: string;
  user_id: string;
  action: string;
  description?: string;
}

export interface ActivityWithDetails extends Activity {
  user?: {
    id: string;
    username: string;
    email: string;
  };
  task?: {
    id: string;
    title: string;
  };
  project?: {
    id: string;
    name: string;
  };
  username?: string;
  project_name?: string;
  task_title?: string;
}

export interface ActivitySummary {
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
