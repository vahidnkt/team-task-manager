import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";

// Interface for log entry
interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  statusCode?: number;
  responseTime?: number;
  userAgent?: string;
  ip: string;
  userId?: string;
  email?: string;
  error?: string;
}

// Simple in-memory logger (in production, you'd use a proper logging library like Winston)
class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep only the last 1000 logs in memory

  log(entry: LogEntry): void {
    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console log for development
    const logMessage = `${entry.timestamp} - ${entry.method} ${entry.url} - ${
      entry.statusCode || "N/A"
    } - ${entry.responseTime || "N/A"}ms - User: ${
      entry.email || "Anonymous"
    } (${entry.ip})`;
    console.log(logMessage);

    if (entry.error) {
      console.error(`Error: ${entry.error}`);
    }
  }

  getLogs(limit?: number): LogEntry[] {
    return limit ? this.logs.slice(-limit) : this.logs;
  }

  getLogsByUser(userId: string, limit?: number): LogEntry[] {
    const userLogs = this.logs.filter((log) => log.userId === userId);
    return limit ? userLogs.slice(-limit) : userLogs;
  }

  getErrorLogs(limit?: number): LogEntry[] {
    const errorLogs = this.logs.filter((log) => log.error);
    return limit ? errorLogs.slice(-limit) : errorLogs;
  }

  clear(): void {
    this.logs = [];
  }
}

export const logger = new Logger();

// Request logging middleware
export const requestLogger = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Get client IP address
  const ip =
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    "unknown";

  // Create initial log entry
  const logEntry: LogEntry = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers["user-agent"],
    ip,
    userId: req.user?.userId,
    email: req.user?.email,
  };

  // Override res.end to capture response details
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any): Response {
    const responseTime = Date.now() - startTime;

    logEntry.statusCode = res.statusCode;
    logEntry.responseTime = responseTime;

    // Log the request
    logger.log(logEntry);

    // Call original end method
    originalEnd.call(this, chunk, encoding);
    return this;
  };

  next();
};

// Error logging middleware
export const errorLogger = (
  error: Error,
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  const ip =
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    "unknown";

  const logEntry: LogEntry = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode || 500,
    userAgent: req.headers["user-agent"],
    ip,
    userId: req.user?.userId,
    email: req.user?.email,
    error: error.message,
  };

  logger.log(logEntry);
  next(error);
};

// Security event logging
export const logSecurityEvent = (
  req: AuthRequest,
  event: string,
  details?: string
): void => {
  const timestamp = new Date().toISOString();
  const ip =
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    "unknown";

  const logEntry: LogEntry = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers["user-agent"],
    ip,
    userId: req.user?.userId,
    email: req.user?.email,
    error: `SECURITY EVENT: ${event}${details ? ` - ${details}` : ""}`,
  };

  logger.log(logEntry);

  // In production, you might want to send security events to a separate monitoring system
  console.warn(
    `🚨 SECURITY EVENT: ${event} - User: ${
      req.user?.email || "Anonymous"
    } - IP: ${ip}`
  );
};

// Activity logging for business events
export const logActivity = (
  req: AuthRequest,
  action: string,
  resource: string,
  resourceId?: string,
  details?: string
): void => {
  const timestamp = new Date().toISOString();
  const ip =
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    "unknown";

  const activityDetails = `${action} ${resource}${
    resourceId ? ` (ID: ${resourceId})` : ""
  }${details ? ` - ${details}` : ""}`;

  const logEntry: LogEntry = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers["user-agent"],
    ip,
    userId: req.user?.userId,
    email: req.user?.email,
    error: `ACTIVITY: ${activityDetails}`, // Using error field for activity tracking
  };

  logger.log(logEntry);
};

// Middleware to log API endpoint access
export const apiAccessLogger = (endpoint: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    logActivity(req, "ACCESS", endpoint);
    next();
  };
};

// Performance monitoring middleware
export const performanceLogger = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const startTime = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const responseTime = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

    if (responseTime > 1000) {
      // Log slow requests (> 1 second)
      console.warn(
        `⚠️  SLOW REQUEST: ${req.method} ${
          req.originalUrl
        } took ${responseTime.toFixed(2)}ms`
      );
    }
  });

  next();
};

// Get logs endpoint helper
export const getLogsData = (
  type?: "all" | "errors" | "user",
  userId?: string,
  limit?: number
) => {
  switch (type) {
    case "errors":
      return logger.getErrorLogs(limit);
    case "user":
      return userId ? logger.getLogsByUser(userId, limit) : [];
    default:
      return logger.getLogs(limit);
  }
};
