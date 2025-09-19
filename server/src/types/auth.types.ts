// Authentication Types
export interface JWTPayload {
  userId: number;
  email: string;
  role: "user" | "admin";
  iat?: number;
  exp?: number;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
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
  expiresIn: string;
  algorithm: string;
  refreshTokenExpiresIn: string;
}
