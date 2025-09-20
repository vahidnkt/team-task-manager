// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface ProjectWithStats extends Project {
  task_count?: number;
  completed_tasks?: number;
  in_progress_tasks?: number;
  pending_tasks?: number;
}
