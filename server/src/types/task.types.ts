// Task Types
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  assignee_id?: number;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assignee_id?: number;
  priority?: TaskPriority;
  due_date?: Date;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assignee_id?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: Date;
}

export interface AssignTaskRequest {
  assignee_id?: number;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface TaskWithDetails extends Task {
  assignee?: {
    id: number;
    username: string;
    email: string;
  };
  project?: {
    id: number;
    name: string;
  };
  comment_count?: number;
}
