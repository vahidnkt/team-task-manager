import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";

/**
 * @deprecated This file is being phased out in favor of DTO-based validation.
 * Most validation is now handled by DTOs in the /dto folder.
 * Only keeping essential validation functions that are still used.
 */

// Middleware to handle validation errors (legacy support)
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
    return;
  }

  next();
};

// Legacy validation functions - kept for backward compatibility
// These should be replaced with DTO validation in future updates

export const validateIdParam = [
  param("id").isUUID().withMessage("ID must be a valid UUID"),
  handleValidationErrors,
];

export const validateProjectIdParam = [
  param("projectId").isUUID().withMessage("Project ID must be a valid UUID"),
  handleValidationErrors,
];

export const validateTaskIdParam = [
  param("taskId").isUUID().withMessage("Task ID must be a valid UUID"),
  handleValidationErrors,
];

export const validatePagination = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a non-negative integer"),

  handleValidationErrors,
];

// Note: All other validation functions have been moved to DTOs:
// - User validation → CreateUserDto, LoginDto, UpdateProfileDto
// - Project validation → CreateProjectDto, UpdateProjectDto
// - Task validation → CreateTaskDto, UpdateTaskDto, AssignTaskDto
// - Comment validation → CreateCommentDto, UpdateCommentDto
// - Query validation → GetAllUsersQueryDto, GetAllTasksQueryDto, etc.
