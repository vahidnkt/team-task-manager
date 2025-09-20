import { Router } from "express";
import { activityController } from "../controllers/activityController";
import {
  authenticateToken,
  requireUser,
  requireAdmin,
} from "../middleware/auth";
import { requireOwnershipOrAdmin } from "../middleware/roleCheck";
import {
  validateIdParam,
  validateProjectIdParam,
  validateTaskIdParam,
  validatePagination,
  handleValidationErrors,
} from "../middleware/validation";
import { requestLogger, apiAccessLogger } from "../middleware/logging";

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(requestLogger);
router.use(requireUser); // All activity routes require at least user role

/**
 * @route   GET /api/activities/recent
 * @desc    Get recent activities across all projects (admin only)
 * @access  Admin
 */
router.get(
  "/recent",
  requireAdmin,
  validatePagination,
  apiAccessLogger("activities-recent"),
  activityController.getRecentActivities.bind(activityController)
);

/**
 * @route   GET /api/activities/my
 * @desc    Get current user's activity summary
 * @access  Private (User+)
 */
router.get(
  "/my",
  apiAccessLogger("user-activity-summary"),
  activityController.getUserActivitySummary.bind(activityController)
);

/**
 * @route   GET /api/activities/users/:userId
 * @desc    Get activities by specific user
 * @access  Private (Own activities or Admin)
 */
router.get(
  "/users/:userId",
  validateIdParam,
  validatePagination,
  requireOwnershipOrAdmin("userId"),
  apiAccessLogger("user-activities"),
  activityController.getUserActivities.bind(activityController)
);

// Project-specific activity routes
/**
 * @route   GET /api/projects/:projectId/activities
 * @desc    Get project activity history
 * @access  Private (User+)
 */
router.get(
  "/projects/:projectId/activities",
  validateProjectIdParam,
  validatePagination,
  apiAccessLogger("project-activities"),
  activityController.getProjectActivities.bind(activityController)
);

/**
 * @route   GET /api/projects/:projectId/activities/stats
 * @desc    Get project activity statistics
 * @access  Private (User+)
 */
router.get(
  "/projects/:projectId/activities/stats",
  validateProjectIdParam,
  apiAccessLogger("project-activity-stats"),
  activityController.getProjectActivityStats.bind(activityController)
);

// Task-specific activity routes
/**
 * @route   GET /api/tasks/:taskId/activities
 * @desc    Get activities for a specific task
 * @access  Private (User+)
 */
router.get(
  "/tasks/:taskId/activities",
  validateTaskIdParam,
  validatePagination,
  apiAccessLogger("task-activities"),
  activityController.getTaskActivities.bind(activityController)
);

export default router;
