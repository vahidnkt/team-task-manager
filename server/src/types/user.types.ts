// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: "user" | "admin";
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, "password_hash">;
}

export interface UserWithoutPassword {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
