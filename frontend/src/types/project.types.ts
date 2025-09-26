// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "active" | "completed" | "on_hold";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // Relations
  creator?: {
    id: string;
    username: string;
    email: string;
  };
  tasks?: ProjectTask[];
  activities?: ProjectActivity[];
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface CompleteProjectRequest {
  completionNotes?: string;
}

export interface ProjectWithStats extends Project {
  taskCount?: number;
  completedTasks?: number;
  inProgressTasks?: number;
  pendingTasks?: number;
  completionPercentage?: number;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: "owner" | "member" | "viewer";
  joinedAt: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

// Query parameters for getting projects
export interface GetProjectsQuery {
  search?: string;
  status?: string;
  priority?: string;
  limit?: number;
  offset?: number;
  sortBy?: "name" | "status" | "priority" | "created_at" | "updated_at";
  sortOrder?: "ASC" | "DESC";
}

// Response from getAllProjects API
export interface ProjectsResponse {
  projects: Project[];
  total: number;
  limit: number;
  offset: number;
}

// Task interface for project relations
export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  projectId: string;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
}

// Activity interface for project relations
export interface ProjectActivity {
  id: string;
  action: string;
  description: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  createdAt: string;
}
