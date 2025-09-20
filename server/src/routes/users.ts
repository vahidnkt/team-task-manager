import { Router } from "express";
import { userController } from "../controllers/userController";
import { authenticateToken, requireAdmin } from "../middleware/auth";
import { requireOwnershipOrAdmin } from "../middleware/roleCheck";
import {
  validateUserUpdate,
  validateIdParam,
  handleValidationErrors,
} from "../middleware/validation";
import { requestLogger, apiAccessLogger } from "../middleware/logging";

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(requestLogger);

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Admin
 */
router.get(
  "/",
  requireAdmin,
  apiAccessLogger("users-list"),
  userController.getAllUsers.bind(userController)
);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  "/profile",
  apiAccessLogger("user-profile"),
  userController.getCurrentUser.bind(userController)
);

/**
 * @route   GET /api/users/:id
 * @desc    Get specific user by ID
 * @access  Private (Own profile or Admin)
 */
router.get(
  "/:id",
  validateIdParam,
  requireOwnershipOrAdmin("id"),
  apiAccessLogger("user-details"),
  userController.getUserById.bind(userController)
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile
 * @access  Private (Own profile or Admin)
 */
router.put(
  "/:id",
  validateIdParam,
  validateUserUpdate,
  requireOwnershipOrAdmin("id"),
  apiAccessLogger("user-update"),
  userController.updateUser.bind(userController)
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (admin only)
 * @access  Admin
 */
router.delete(
  "/:id",
  validateIdParam,
  requireAdmin,
  apiAccessLogger("user-delete"),
  userController.deleteUser.bind(userController)
);

export default router;
