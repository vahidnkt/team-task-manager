/**
 * Advanced logging utility for the task manager application
 * This provides structured logging with different levels and formats
 */

import fs from "fs";
import path from "path";
import environment from "../config/environment";
import { LOG_LEVELS } from "./constants";

// Log level enum
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  metadata?: any;
  stack?: string;
  requestId?: string;
  userId?: string;
  ip?: string;
}

// Logger configuration interface
export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  logDir: string;
  maxFileSize: number;
  maxFiles: number;
}

export class Logger {
  private config: LoggerConfig;
  private logDir: string;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: this.getLogLevelFromEnv(),
      enableConsole: environment.server.env !== "production",
      enableFile: true,
      logDir: path.join(process.cwd(), "logs"),
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      ...config,
    };

    this.logDir = this.config.logDir;
    this.ensureLogDirectory();
  }

  // Get log level from environment
  private getLogLevelFromEnv(): LogLevel {
    const envLevel = environment.logging.level?.toLowerCase() || "info";
    switch (envLevel) {
      case "error":
        return LogLevel.ERROR;
      case "warn":
        return LogLevel.WARN;
      case "info":
        return LogLevel.INFO;
      case "debug":
        return LogLevel.DEBUG;
      default:
        return LogLevel.INFO;
    }
  }

  // Ensure log directory exists
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  // Create log entry
  private createLogEntry(
    level: string,
    message: string,
    metadata?: any,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      metadata,
      stack: error?.stack,
      requestId: this.getRequestId(),
      userId: this.getCurrentUserId(),
      ip: this.getCurrentIP(),
    };
  }

  // Get current request ID (from async local storage or similar)
  private getRequestId(): string | undefined {
    // This would be implemented with async_hooks or similar
    // For now, return undefined
    return undefined;
  }

  // Get current user ID (from request context)
  private getCurrentUserId(): string | undefined {
    // This would be implemented with request context
    // For now, return undefined
    return undefined;
  }

  // Get current IP (from request context)
  private getCurrentIP(): string | undefined {
    // This would be implemented with request context
    // For now, return undefined
    return undefined;
  }

  // Check if level should be logged
  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level;
  }

  // Format log entry for console
  private formatForConsole(entry: LogEntry): string {
    const colors = {
      ERROR: "\x1b[31m", // Red
      WARN: "\x1b[33m", // Yellow
      INFO: "\x1b[36m", // Cyan
      DEBUG: "\x1b[37m", // White
      RESET: "\x1b[0m",
    };

    const color = colors[entry.level as keyof typeof colors] || colors.INFO;
    const timestamp = entry.timestamp.replace("T", " ").replace("Z", "");

    let output = `${color}[${timestamp}] ${entry.level}${colors.RESET}: ${entry.message}`;

    if (entry.requestId) {
      output += ` [ReqID: ${entry.requestId}]`;
    }

    if (entry.userId) {
      output += ` [User: ${entry.userId}]`;
    }

    if (entry.ip) {
      output += ` [IP: ${entry.ip}]`;
    }

    if (entry.metadata) {
      output += `\n  Metadata: ${JSON.stringify(entry.metadata, null, 2)}`;
    }

    if (entry.stack) {
      output += `\n  Stack: ${entry.stack}`;
    }

    return output;
  }

  // Format log entry for file
  private formatForFile(entry: LogEntry): string {
    return JSON.stringify(entry) + "\n";
  }

  // Write to console
  private writeToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const formatted = this.formatForConsole(entry);

    if (entry.level === "ERROR") {
      console.error(formatted);
    } else if (entry.level === "WARN") {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  // Write to file
  private writeToFile(entry: LogEntry): void {
    if (!this.config.enableFile) return;

    const filename = this.getLogFilename();
    const filepath = path.join(this.logDir, filename);
    const formatted = this.formatForFile(entry);

    try {
      // Check file size and rotate if necessary
      this.rotateLogIfNeeded(filepath);

      fs.appendFileSync(filepath, formatted, "utf8");
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  }

  // Get log filename (e.g., app-2023-10-01.log)
  private getLogFilename(): string {
    const date = new Date().toISOString().split("T")[0];
    return `app-${date}.log`;
  }

  // Rotate log file if it exceeds max size
  private rotateLogIfNeeded(filepath: string): void {
    try {
      if (!fs.existsSync(filepath)) return;

      const stats = fs.statSync(filepath);
      if (stats.size < this.config.maxFileSize) return;

      // Rotate current file
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const rotatedPath = filepath.replace(".log", `-${timestamp}.log`);
      fs.renameSync(filepath, rotatedPath);

      // Clean up old files
      this.cleanupOldLogFiles();
    } catch (error) {
      console.error("Failed to rotate log file:", error);
    }
  }

  // Clean up old log files
  private cleanupOldLogFiles(): void {
    try {
      const files = fs
        .readdirSync(this.logDir)
        .filter((file) => file.endsWith(".log"))
        .map((file) => ({
          name: file,
          path: path.join(this.logDir, file),
          mtime: fs.statSync(path.join(this.logDir, file)).mtime,
        }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      // Keep only the most recent files
      if (files.length > this.config.maxFiles) {
        const filesToDelete = files.slice(this.config.maxFiles);
        filesToDelete.forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }
    } catch (error) {
      console.error("Failed to cleanup old log files:", error);
    }
  }

  // Core logging method
  private log(
    level: LogLevel,
    levelName: string,
    message: string,
    metadata?: any,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(levelName, message, metadata, error);

    this.writeToConsole(entry);
    this.writeToFile(entry);
  }

  // Public logging methods
  error(message: string, error?: Error, metadata?: any): void {
    this.log(LogLevel.ERROR, "error", message, metadata, error);
  }

  warn(message: string, metadata?: any): void {
    this.log(LogLevel.WARN, "warn", message, metadata);
  }

  info(message: string, metadata?: any): void {
    this.log(LogLevel.INFO, "info", message, metadata);
  }

  debug(message: string, metadata?: any): void {
    this.log(LogLevel.DEBUG, "debug", message, metadata);
  }

  // HTTP request logging
  http(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    metadata?: any
  ): void {
    const message = `${method} ${url} ${statusCode} ${responseTime}ms`;
    this.info(message, metadata);
  }

  // Database query logging
  query(sql: string, duration: number, metadata?: any): void {
    const message = `DB Query: ${sql.substring(0, 100)}${
      sql.length > 100 ? "..." : ""
    } (${duration}ms)`;
    this.debug(message, metadata);
  }

  // Security event logging
  security(event: string, metadata?: any): void {
    const message = `SECURITY: ${event}`;
    this.warn(message, metadata);
  }

  // Performance logging
  performance(operation: string, duration: number, metadata?: any): void {
    const level = duration > 1000 ? "warn" : "info";
    const message = `PERFORMANCE: ${operation} took ${duration}ms`;

    if (level === "warn") {
      this.warn(message, metadata);
    } else {
      this.info(message, metadata);
    }
  }

  // Create child logger with context
  child(context: any): Logger {
    const childLogger = new Logger(this.config);

    // Override the createLogEntry method to include context
    const originalCreateLogEntry = childLogger.createLogEntry.bind(childLogger);
    childLogger.createLogEntry = (
      level: string,
      message: string,
      metadata?: any,
      error?: Error
    ) => {
      const entry = originalCreateLogEntry(level, message, metadata, error);
      entry.metadata = { ...context, ...entry.metadata };
      return entry;
    };

    return childLogger;
  }

  // Get recent log entries (for admin dashboard)
  getRecentLogs(count: number = 100): LogEntry[] {
    try {
      const filename = this.getLogFilename();
      const filepath = path.join(this.logDir, filename);

      if (!fs.existsSync(filepath)) return [];

      const content = fs.readFileSync(filepath, "utf8");
      const lines = content.trim().split("\n").slice(-count);

      return lines
        .map((line) => {
          try {
            return JSON.parse(line) as LogEntry;
          } catch {
            return null;
          }
        })
        .filter((entry) => entry !== null) as LogEntry[];
    } catch (error) {
      console.error("Failed to read log file:", error);
      return [];
    }
  }

  // Search logs
  searchLogs(query: string, level?: string): LogEntry[] {
    try {
      const logs = this.getRecentLogs(1000);

      return logs.filter((entry) => {
        const matchesQuery =
          entry.message.toLowerCase().includes(query.toLowerCase()) ||
          JSON.stringify(entry.metadata || {})
            .toLowerCase()
            .includes(query.toLowerCase());
        const matchesLevel =
          !level || entry.level.toLowerCase() === level.toLowerCase();

        return matchesQuery && matchesLevel;
      });
    } catch (error) {
      console.error("Failed to search logs:", error);
      return [];
    }
  }
}

// Create default logger instance
export const logger = new Logger();

// Export helper functions
export const createLogger = (config?: Partial<LoggerConfig>) =>
  new Logger(config);

export default logger;
