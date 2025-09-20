import { Router } from "express";
import { commentController } from "../controllers/commentController";
import { authenticateToken, requireUser } from "../middleware/auth";
import {
  validateDto,
  validateQueryDto,
  validateParamDto,
} from "../middleware/dtoValidation";
import {
  CreateCommentDto,
  UpdateCommentDto,
  IdParamDto,
  TaskIdParamDto,
  PaginationQueryDto,
} from "../dto";
import { requestLogger, apiAccessLogger } from "../middleware/logging";

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(requestLogger);
router.use(requireUser); // All comment routes require at least user role

/**
 * @route   GET /api/comments/:id
 * @desc    Get specific comment by ID
 * @access  Private (User+)
 */
router.get(
  "/:id",
  validateParamDto(IdParamDto),
  apiAccessLogger("comment-details"),
  commentController.getCommentById.bind(commentController)
);

/**
 * @route   PUT /api/comments/:id
 * @desc    Update comment
 * @access  Private (Comment author or Admin)
 */
router.put(
  "/:id",
  validateParamDto(IdParamDto),
  validateDto(UpdateCommentDto),
  apiAccessLogger("comment-update"),
  commentController.updateComment.bind(commentController)
);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete comment
 * @access  Private (Comment author or Admin)
 */
router.delete(
  "/:id",
  validateParamDto(IdParamDto),
  apiAccessLogger("comment-delete"),
  commentController.deleteComment.bind(commentController)
);

/**
 * @route   GET /api/comments/my
 * @desc    Get comments by current user
 * @access  Private (User+)
 */
router.get(
  "/my",
  validateQueryDto(PaginationQueryDto),
  apiAccessLogger("user-comments"),
  commentController.getUserComments.bind(commentController)
);

// Task-specific comment routes
/**
 * @route   GET /api/tasks/:taskId/comments
 * @desc    Get all comments for a task
 * @access  Private (User+)
 */
router.get(
  "/tasks/:taskId/comments",
  validateParamDto(TaskIdParamDto),
  validateQueryDto(PaginationQueryDto),
  apiAccessLogger("task-comments"),
  commentController.getCommentsByTask.bind(commentController)
);

/**
 * @route   POST /api/tasks/:taskId/comments
 * @desc    Add comment to task
 * @access  Private (User+)
 */
router.post(
  "/tasks/:taskId/comments",
  validateParamDto(TaskIdParamDto),
  validateDto(CreateCommentDto),
  apiAccessLogger("comment-create"),
  commentController.createComment.bind(commentController)
);

export default router;
