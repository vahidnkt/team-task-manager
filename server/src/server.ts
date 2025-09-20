import database from "./config/database/database";
import sequelizeDatabase from "./config/database/sequelize";
import App from "./app";
import config from "./config/environment";

class Server {
  private app: App;
  private server: any;

  constructor() {
    this.app = new App();
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await database.connect();

      // Connect to Sequelize
      await sequelizeDatabase.connect();

      // Start server
      const app = this.app.getApp();
      this.server = app.listen(config.server.port, () => {
        console.log(`Server running on port ${config.server.port}`);
      });

      // Graceful shutdown
      this.setupGracefulShutdown();
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    // Handle graceful shutdown
    const gracefulShutdown = async (signal: string): Promise<void> => {
      console.log(`Received ${signal}. Starting graceful shutdown...`);

      try {
        // Close server
        if (this.server) {
          this.server.close(() => {
            console.log("📴 HTTP server closed");
          });
        }

        // Close database connections
        await database.disconnect();
        console.log("📴 Database connection closed");

        await sequelizeDatabase.disconnect();
        console.log("📴 Sequelize connection closed");

        console.log("✅ Graceful shutdown completed");
        process.exit(0);
      } catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
      }
    };

    // Listen for termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("❌ Uncaught Exception:", error);
      gracefulShutdown("uncaughtException");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
      gracefulShutdown("unhandledRejection");
    });
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new Server();
  server.start();
}

export default Server;
