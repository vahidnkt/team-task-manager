import { Router } from "express";
import authController from "../controllers/authController";
import { authenticateToken, optionalAuth } from "../middleware/auth";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", authController.register.bind(authController));

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", authController.login.bind(authController));

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

export default router;
