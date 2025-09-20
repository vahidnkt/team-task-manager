import { Router } from "express";
import { projectController } from "../controllers/projectController";
import {
  authenticateToken,
  requireUser,
  requireAdmin,
} from "../middleware/auth";
import { requireProjectAccess } from "../middleware/roleCheck";
import {
  validateProjectCreation,
  validateProjectUpdate,
  validateIdParam,
  handleValidationErrors,
} from "../middleware/validation";
import { requestLogger, apiAccessLogger } from "../middleware/logging";

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(requestLogger);
router.use(requireUser); // All project routes require at least user role

/**
 * @route   GET /api/projects?search=web&status=active&priority=high&limit=10&offset=0&sortBy=name&sortOrder=ASC
 * @desc    Get all projects with search, filter, and pagination
 * @access  Private (User+)
 */
router.get(
  "/",
  apiAccessLogger("projects-list"),
  projectController.getAllProjects.bind(projectController)
);

/**
 * @route   POST /api/projects
 * @desc    Create new project
 * @access  Private (Admin only)
 */
router.post(
  "/",
  requireAdmin,
  validateProjectCreation,
  apiAccessLogger("project-create"),
  projectController.createProject.bind(projectController)
);

/**
 * @route   GET /api/projects/my
 * @desc    Get projects created by or assigned to current user
 * @access  Private (User+)
 */
router.get(
  "/my",
  apiAccessLogger("user-projects"),
  projectController.getUserProjects.bind(projectController)
);

/**
 * @route   GET /api/projects/:id
 * @desc    Get specific project by ID
 * @access  Private (User+)
 */
router.get(
  "/:id",
  validateIdParam,
  requireProjectAccess,
  apiAccessLogger("project-details"),
  projectController.getProjectById.bind(projectController)
);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private (Project creator or Admin)
 */
router.put(
  "/:id",
  requireAdmin,
  validateIdParam,
  validateProjectUpdate,
  requireProjectAccess,
  apiAccessLogger("project-update"),
  projectController.updateProject.bind(projectController)
);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private (Project creator or Admin)
 */
router.delete(
  "/:id",
  requireAdmin,
  validateIdParam,
  requireProjectAccess,
  apiAccessLogger("project-delete"),
  projectController.deleteProject.bind(projectController)
);

export default router;
