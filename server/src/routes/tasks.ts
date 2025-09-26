import { Router } from "express";
import { taskController } from "../controllers/taskController";
import {
  authenticateToken,
  requireAdmin,
  requireUser,
} from "../middleware/auth";
import { requireProjectAccess } from "../middleware/roleCheck";
import {
  validateDto,
  validateQueryDto,
  validateParamDto,
} from "../middleware/dtoValidation";
import {
  checkProjectStatus,
  checkProjectStatusForCreation,
  checkProjectStatusForUpdate,
} from "../middleware/projectStatusCheck";
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
  AssignTaskDto,
  GetAllTasksQueryDto,
  GetMyTasksQueryDto,
  GetInProgressTasksQueryDto,
  GetCompletedTasksQueryDto,
  IdParamDto,
  ProjectIdParamDto,
} from "../dto";
import { requestLogger, apiAccessLogger } from "../middleware/logging";

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(requestLogger);
router.use(requireUser); // All task routes require at least user role

/**
 * @route   GET /api/tasks?search=authentication&status=in-progress&priority=high&assignee_id=user-uuid&project_id=project-uuid&limit=10&offset=0&sortBy=title&sortOrder=ASC
 * @desc    Get all tasks with search, filter, and pagination
 * @access  Private (User+)
 */
router.get(
  "/",
  validateQueryDto(GetAllTasksQueryDto),
  apiAccessLogger("all-tasks"),
  taskController.getAllTasks.bind(taskController)
);

/**
 * @route   GET /api/tasks/my?search=authentication&status=in-progress&priority=high&project_id=project-uuid&limit=10&offset=0&sortBy=title&sortOrder=ASC
 * @desc    Get tasks assigned to current user with search, filter, and pagination
 * @access  Private (User+)
 */
router.get(
  "/my",
  validateQueryDto(GetMyTasksQueryDto),
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
  validateParamDto(IdParamDto),
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
  requireAdmin,
  validateParamDto(IdParamDto),
  validateDto(UpdateTaskDto),
  checkProjectStatusForUpdate,
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
  requireAdmin,
  validateParamDto(IdParamDto),
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
  validateParamDto(IdParamDto),
  validateDto(UpdateTaskStatusDto),
  checkProjectStatus,
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
  requireAdmin,
  validateParamDto(IdParamDto),
  validateDto(AssignTaskDto),
  checkProjectStatusForUpdate,
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
  validateParamDto(ProjectIdParamDto),
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
  validateParamDto(ProjectIdParamDto),
  validateDto(CreateTaskDto),
  requireProjectAccess,
  checkProjectStatusForCreation,
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
  validateParamDto(ProjectIdParamDto),
  requireProjectAccess,
  apiAccessLogger("project-tasks-by-status"),
  taskController.getTasksByStatus.bind(taskController)
);

/**
 * @route   GET /api/tasks/in-progress?search=authentication&priority=high&assignee_id=user-uuid&project_id=project-uuid&limit=10&offset=0&sortBy=title&sortOrder=ASC
 * @desc    Get in-progress tasks with search, filter, and pagination
 * @access  Private (User+)
 */
router.get(
  "/in-progress",
  validateQueryDto(GetInProgressTasksQueryDto),
  apiAccessLogger("in-progress-tasks"),
  taskController.getInProgressTasks.bind(taskController)
);

/**
 * @route   GET /api/tasks/completed?search=authentication&priority=high&assignee_id=user-uuid&project_id=project-uuid&limit=10&offset=0&sortBy=title&sortOrder=ASC
 * @desc    Get completed tasks with search, filter, and pagination
 * @access  Private (User+)
 */
router.get(
  "/completed",
  validateQueryDto(GetCompletedTasksQueryDto),
  apiAccessLogger("completed-tasks"),
  taskController.getCompletedTasks.bind(taskController)
);

export default router;
