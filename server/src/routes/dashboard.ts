import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController";
import { authenticateToken, requireUser } from "../middleware/auth";
import { validateQueryDto } from "../middleware/dtoValidation";
import {
  DashboardStatsQueryDto,
  DashboardRecentQueryDto,
  DashboardProjectsQueryDto,
  DashboardDataQueryDto,
} from "../dto";
import { requestLogger, apiAccessLogger } from "../middleware/logging";

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(requestLogger);
router.use(requireUser); // All dashboard routes require at least user role

/**
 * @route   GET /api/dashboard
 * @desc    Get complete dashboard data (stats, recent tasks, activities, projects)
 * @access  Private (User+)
 */
router.get(
  "/",
  validateQueryDto(DashboardDataQueryDto),
  apiAccessLogger("dashboard-complete"),
  dashboardController.getDashboardData.bind(dashboardController)
);

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics only
 * @access  Private (User+)
 */
router.get(
  "/stats",
  validateQueryDto(DashboardStatsQueryDto),
  apiAccessLogger("dashboard-stats"),
  dashboardController.getDashboardStats.bind(dashboardController)
);

/**
 * @route   GET /api/dashboard/recent-tasks
 * @desc    Get recent tasks for dashboard
 * @access  Private (User+)
 */
router.get(
  "/recent-tasks",
  validateQueryDto(DashboardRecentQueryDto),
  apiAccessLogger("dashboard-recent-tasks"),
  dashboardController.getRecentTasks.bind(dashboardController)
);

/**
 * @route   GET /api/dashboard/recent-activities
 * @desc    Get recent activities for dashboard
 * @access  Private (User+)
 */
router.get(
  "/recent-activities",
  validateQueryDto(DashboardRecentQueryDto),
  apiAccessLogger("dashboard-recent-activities"),
  dashboardController.getRecentActivities.bind(dashboardController)
);

/**
 * @route   GET /api/dashboard/projects
 * @desc    Get projects overview for dashboard
 * @access  Private (User+)
 */
router.get(
  "/projects",
  validateQueryDto(DashboardProjectsQueryDto),
  apiAccessLogger("dashboard-projects"),
  dashboardController.getProjects.bind(dashboardController)
);

/**
 * @route   GET /api/dashboard/activity-summary
 * @desc    Get user activity summary
 * @access  Private (User+)
 */
router.get(
  "/activity-summary",
  validateQueryDto(DashboardStatsQueryDto),
  apiAccessLogger("dashboard-activity-summary"),
  dashboardController.getUserActivitySummary.bind(dashboardController)
);

export default router;
