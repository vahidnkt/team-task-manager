// Task Types
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // Relations
  assignee?: {
    id: string;
    username: string;
    email: string;
  };
  project?: {
    id: string;
    name: string;
  };
  comments?: Comment[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assignee_id?: string;
  priority?: TaskPriority;
  due_date?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assignee_id?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
}

export interface AssignTaskRequest {
  assignee_id?: string | null;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface TaskWithDetails extends Task {
  commentCount?: number;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
}

// Query parameters for getting tasks
export interface GetTasksQuery {
  search?: string;
  status?: string;
  priority?: string;
  assignee_id?: string;
  project_id?: string;
  limit?: number;
  offset?: number;
  sortBy?:
    | "title"
    | "status"
    | "priority"
    | "created_at"
    | "updated_at"
    | "due_date";
  sortOrder?: "ASC" | "DESC";
}

// Response from getAllTasks API
export interface TasksResponse {
  tasks: Task[];
  total: number;
  limit: number;
  offset: number;
}

export interface TaskFilter {
  search?: string;
  status?: string;
  priority?: string;
  assignee_id?: string;
  project_id?: string;
  limit?: number;
  offset?: number;
  sortBy?:
    | "title"
    | "status"
    | "priority"
    | "created_at"
    | "updated_at"
    | "due_date";
  sortOrder?: "ASC" | "DESC";
}

export interface TaskSort {
  field:
    | "title"
    | "priority"
    | "status"
    | "dueDate"
    | "createdAt"
    | "updatedAt";
  direction: "asc" | "desc";
}

// Comment interface for task relations
export interface Comment {
  id: string;
  content: string;
  userId: string;
  taskId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}
