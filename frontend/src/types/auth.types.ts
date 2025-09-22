// Authentication Types
export interface JWTPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
  iat?: number;
  exp?: number;
}

export interface TokenResponse {
  token: string; // Single JWT token with 7-day expiry
  tokenType: string;
  expiresIn: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// JWT Configuration
export interface JWTConfig {
  secret: string;
  expiresIn: string; // 7 days
  algorithm: string;
}

// Frontend Auth State
export interface AuthState {
  user: any | null; // Will be properly typed when imported
  token: string | null; // Single JWT token with 7-day expiry
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// User types are defined in user.types.ts
