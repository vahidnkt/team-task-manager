import { Router } from "express";
import { activityController } from "../controllers/activityController";
import {
  authenticateToken,
  requireUser,
  requireAdmin,
} from "../middleware/auth";
import { requireOwnershipOrAdmin } from "../middleware/roleCheck";
import {
  validateQueryDto,
  validateParamDto,
} from "../middleware/dtoValidation";
import {
  IdParamDto,
  ProjectIdParamDto,
  TaskIdParamDto,
  PaginationQueryDto,
} from "../dto";
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
  validateQueryDto(PaginationQueryDto),
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
 * @route   GET /api/activities/users/:id
 * @desc    Get activities by specific user
 * @access  Private (Own activities or Admin)
 */
router.get(
  "/users/:id",
  validateParamDto(IdParamDto),
  validateQueryDto(PaginationQueryDto),
  requireOwnershipOrAdmin("id"),
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
  validateParamDto(ProjectIdParamDto),
  validateQueryDto(PaginationQueryDto),
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
  validateParamDto(ProjectIdParamDto),
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
  validateParamDto(TaskIdParamDto),
  validateQueryDto(PaginationQueryDto),
  apiAccessLogger("task-activities"),
  activityController.getTaskActivities.bind(activityController)
);

/**
 * @route   DELETE /api/activities/:id
 * @desc    Delete a specific activity (admin only)
 * @access  Admin
 */
router.delete(
  "/:id",
  requireAdmin,
  validateParamDto(IdParamDto),
  apiAccessLogger("activity-delete"),
  activityController.deleteActivity.bind(activityController)
);

/**
 * @route   PUT /api/activities/:id
 * @desc    Update a specific activity (admin only)
 * @access  Admin
 */
router.put(
  "/:id",
  requireAdmin,
  validateParamDto(IdParamDto),
  apiAccessLogger("activity-update"),
  activityController.updateActivity.bind(activityController)
);

export default router;
