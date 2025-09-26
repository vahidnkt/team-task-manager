import { Router } from "express";
import { projectController } from "../controllers/projectController";
import {
  authenticateToken,
  requireUser,
  requireAdmin,
} from "../middleware/auth";
import { requireProjectAccess } from "../middleware/roleCheck";
import {
  validateDto,
  validateQueryDto,
  validateParamDto,
} from "../middleware/dtoValidation";
import {
  CreateProjectDto,
  UpdateProjectDto,
  GetAllProjectsQueryDto,
  IdParamDto,
  CompleteProjectDto,
} from "../dto";
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
  validateQueryDto(GetAllProjectsQueryDto),
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
  validateDto(CreateProjectDto),
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
  validateParamDto(IdParamDto),
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
  validateParamDto(IdParamDto),
  validateDto(UpdateProjectDto),
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
  validateParamDto(IdParamDto),
  requireProjectAccess,
  apiAccessLogger("project-delete"),
  projectController.deleteProject.bind(projectController)
);

/**
 * @route   POST /api/projects/:id/complete
 * @desc    Complete a project
 * @access  Private (Admin only)
 */
router.post(
  "/:id/complete",
  requireAdmin,
  validateParamDto(IdParamDto),
  validateDto(CompleteProjectDto),
  requireProjectAccess,
  apiAccessLogger("project-complete"),
  projectController.completeProject.bind(projectController)
);

export default router;
