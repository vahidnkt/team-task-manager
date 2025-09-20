import { Router } from "express";
import authController from "../controllers/authController";
import { authenticateToken, optionalAuth } from "../middleware/auth";
import {
  validateDto,
  validateQueryDto,
  validateParamDto,
} from "../middleware/dtoValidation";
import {
  CreateUserDto,
  LoginDto,
  UpdateProfileDto,
  GetAllUsersQueryDto,
  IdParamDto,
} from "../dto";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  validateDto(CreateUserDto),
  authController.register.bind(authController)
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  "/login",
  validateDto(LoginDto),
  authController.login.bind(authController)
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post(
  "/logout",
  authenticateToken,
  authController.logout.bind(authController)
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  "/profile",
  authenticateToken,
  authController.getProfile.bind(authController)
);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify token validity
 * @access  Private
 */
router.get(
  "/verify",
  authenticateToken,
  authController.verifyToken.bind(authController)
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile (username, email, password)
 * @access  Private
 */
router.put(
  "/profile",
  authenticateToken,
  validateDto(UpdateProfileDto),
  authController.updateProfile.bind(authController)
);

/**
 * @route   DELETE /api/auth/account
 * @desc    Delete user account (soft delete)
 * @access  Private
 */
router.delete(
  "/account",
  authenticateToken,
  authController.deleteAccount.bind(authController)
);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users
 * @access  Private
 */
router.get(
  "/users",
  authenticateToken,
  validateQueryDto(GetAllUsersQueryDto),
  authController.getAllUsers.bind(authController)
);

/**
 * @route   GET /api/auth/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get(
  "/users/:id",
  authenticateToken,
  validateParamDto(IdParamDto),
  authController.getUserById.bind(authController)
);

export default router;
