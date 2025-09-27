// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface UserWithoutPassword {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Request/Response Types
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: "user" | "admin";
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserWithoutPassword;
}

// Query Types
export interface GetAllUsersQuery {
  search?: string;
  role?: "user" | "admin";
  limit?: number;
  offset?: number;
  sortBy?: "username" | "email" | "createdAt" | "updatedAt";
  sortOrder?: "ASC" | "DESC";
}

export interface UsersResponse {
  users: UserWithoutPassword[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User Statistics
export interface UserStats {
  userId: string;
  totalProjectsCreated: number;
  totalTasksAssigned: number;
  totalTasksCompleted: number;
  totalCommentsMade: number;
  accountCreated: Date;
  lastActive: Date;
}
