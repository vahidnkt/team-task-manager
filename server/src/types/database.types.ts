// Database Types
export interface DatabaseConnection {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  charset?: string;
  timezone?: string;
  acquireTimeout?: number;
  timeout?: number;
  reconnect?: boolean;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  search?: string;
  filters?: Record<string, any>;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
  charset: string;
  timezone: string;
  acquireTimeout: number;
  timeout: number;
  reconnect: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset: number;
}

export interface SearchOptions {
  searchTerm?: string;
  searchFields?: string[];
  caseSensitive?: boolean;
}
