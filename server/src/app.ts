import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import config from "./config/environment";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

// Import routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import projectRoutes from "./routes/projects";
import taskRoutes from "./routes/tasks";
import commentRoutes from "./routes/comments";
import activityRoutes from "./routes/activities";
import dashboardRoutes from "./routes/dashboard";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
          },
        },
        crossOriginEmbedderPolicy: false,
      })
    );

    // CORS configuration
    this.app.use(
      cors({
        origin: (origin, callback) => {
          // Allow requests with no origin (like mobile apps or curl requests)
          if (!origin) return callback(null, true);

          const allowedOrigins = Array.isArray(config.cors.origin)
            ? config.cors.origin
            : [config.cors.origin];

          console.log("CORS Request from origin:", origin);
          console.log("Allowed origins:", allowedOrigins);

          if (allowedOrigins.includes(origin)) {
            console.log("✅ CORS: Origin allowed");
            return callback(null, true);
          }

          // In development, allow any localhost origin
          if (
            config.server.env === "development" &&
            origin.includes("localhost")
          ) {
            console.log("✅ CORS: Localhost allowed in development");
            return callback(null, true);
          }

          console.log("❌ CORS: Origin not allowed");
          return callback(new Error("Not allowed by CORS"), false);
        },
        credentials: config.cors.credentials,
        methods: config.cors.methods,
        allowedHeaders: config.cors.allowedHeaders,
        optionsSuccessStatus: 200, // Some legacy browsers choke on 204
      })
    );

    // Compression middleware
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.security.rateLimitWindowMs,
      max: config.security.rateLimitMaxRequests,
      message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use("/api/", limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Logging middleware
    if (config.server.env !== "test") {
      this.app.use(morgan("combined"));
    }

    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        environment: config.server.env,
      });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/users", userRoutes);
    this.app.use("/api/projects", projectRoutes);
    this.app.use("/api/tasks", taskRoutes);
    this.app.use("/api/comments", commentRoutes);
    this.app.use("/api/activities", activityRoutes);
    this.app.use("/api/dashboard", dashboardRoutes);

    // API info endpoint
    this.app.get("/api", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Team Task Manager API",
        version: config.app.version,
        environment: config.server.env,
        endpoints: {
          auth: "/api/auth",
          users: "/api/users",
          projects: "/api/projects",
          tasks: "/api/tasks",
          comments: "/api/comments",
          activities: "/api/activities",
          dashboard: "/api/dashboard",
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  public getApp(): express.Application {
    return this.app;
  }
}

export default App;
