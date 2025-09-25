import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController";
import { authenticateToken, requireUser } from "../middleware/auth";
import { validateQueryDto } from "../middleware/dtoValidation";
import { DashboardQueryDto } from "../dto";
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
 * @query   statsDays, recentTasksLimit, recentTasksOffset, recentActivitiesLimit,
 *          recentActivitiesOffset, projectsLimit, projectsOffset, projectsStatus,
 *          includeStats, includeRecentTasks, includeRecentActivities, includeProjects
 *
 * @example GET /api/dashboard?statsDays=30&recentTasksLimit=5&projectsStatus=active
 * @example GET /api/dashboard?includeStats=true&includeRecentTasks=false
 */
router.get(
  "/",
  validateQueryDto(DashboardQueryDto),
  apiAccessLogger("dashboard-complete"),
  dashboardController.getDashboard.bind(dashboardController)
);

export default router;
