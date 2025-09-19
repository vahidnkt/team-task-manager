// Activity Types
export interface Activity {
  id: number;
  project_id: number;
  task_id?: number;
  user_id: number;
  action: string;
  description?: string;
  created_at: Date;
}

export interface CreateActivityRequest {
  project_id: number;
  task_id?: number;
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
}
