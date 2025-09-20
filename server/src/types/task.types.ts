// Task Types
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  assignee_id?: string;
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
  assignee_id?: string;
  priority?: TaskPriority;
  due_date?: Date;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assignee_id?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: Date;
}

export interface AssignTaskRequest {
  assignee_id?: string;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface TaskWithDetails extends Task {
  assignee?: {
    id: string;
    username: string;
    email: string;
  };
  project?: {
    id: string;
    name: string;
  };
  comment_count?: number;
}
