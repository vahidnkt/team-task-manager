import { Router } from "express";
import { taskController } from "../controllers/taskController";
import { authenticateToken, requireUser } from "../middleware/auth";
import { requireProjectAccess } from "../middleware/roleCheck";
import {
  validateTaskCreation,
  validateTaskUpdate,
  validateTaskStatusUpdate,
  validateTaskAssignment,
  validateIdParam,
  validateProjectIdParam,
  validatePagination,
  handleValidationErrors,
} from "../middleware/validation";
import { requestLogger, apiAccessLogger } from "../middleware/logging";

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(requestLogger);
router.use(requireUser); // All task routes require at least user role

/**
 * @route   GET /api/tasks/my
 * @desc    Get tasks assigned to current user
 * @access  Private (User+)
 */
router.get(
  "/my",
  apiAccessLogger("user-tasks"),
  taskController.getMyTasks.bind(taskController)
);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get specific task by ID
 * @access  Private (User+)
 */
router.get(
  "/:id",
  validateIdParam,
  apiAccessLogger("task-details"),
  taskController.getTaskById.bind(taskController)
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Private (User+)
 */
router.put(
  "/:id",
  validateIdParam,
  validateTaskUpdate,
  apiAccessLogger("task-update"),
  taskController.updateTask.bind(taskController)
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Private (User+)
 */
router.delete(
  "/:id",
  validateIdParam,
  apiAccessLogger("task-delete"),
  taskController.deleteTask.bind(taskController)
);

/**
 * @route   PATCH /api/tasks/:id/status
 * @desc    Update task status
 * @access  Private (User+)
 */
router.patch(
  "/:id/status",
  validateIdParam,
  validateTaskStatusUpdate,
  apiAccessLogger("task-status-update"),
  taskController.updateTaskStatus.bind(taskController)
);

/**
 * @route   PATCH /api/tasks/:id/assign
 * @desc    Assign/unassign task
 * @access  Private (User+)
 */
router.patch(
  "/:id/assign",
  validateIdParam,
  validateTaskAssignment,
  apiAccessLogger("task-assignment"),
  taskController.assignTask.bind(taskController)
);

// Project-specific task routes
/**
 * @route   GET /api/projects/:projectId/tasks
 * @desc    Get all tasks in a project
 * @access  Private (User+)
 */
router.get(
  "/projects/:projectId/tasks",
  validateProjectIdParam,
  validatePagination,
  requireProjectAccess,
  apiAccessLogger("project-tasks"),
  taskController.getTasksByProject.bind(taskController)
);

/**
 * @route   POST /api/projects/:projectId/tasks
 * @desc    Create new task in project
 * @access  Private (User+)
 */
router.post(
  "/projects/:projectId/tasks",
  validateProjectIdParam,
  validateTaskCreation,
  requireProjectAccess,
  apiAccessLogger("task-create"),
  taskController.createTask.bind(taskController)
);

/**
 * @route   GET /api/projects/:projectId/tasks/status
 * @desc    Get tasks by status in a project
 * @access  Private (User+)
 */
router.get(
  "/projects/:projectId/tasks/status",
  validateProjectIdParam,
  validatePagination,
  requireProjectAccess,
  apiAccessLogger("project-tasks-by-status"),
  taskController.getTasksByStatus.bind(taskController)
);

export default router;
