import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }

  next();
};

// User validation rules
export const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either "user" or "admin"'),

  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors
];

export const validateUserUpdate = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either "user" or "admin"'),

  handleValidationErrors
];

// Project validation rules
export const validateProjectCreation = [
  body('name')
    .isLength({ min: 1, max: 255 })
    .withMessage('Project name is required and must be less than 255 characters')
    .trim(),

  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .trim(),

  handleValidationErrors
];

export const validateProjectUpdate = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Project name must be less than 255 characters')
    .trim(),

  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .trim(),

  handleValidationErrors
];

// Task validation rules
export const validateTaskCreation = [
  body('title')
    .isLength({ min: 1, max: 255 })
    .withMessage('Task title is required and must be less than 255 characters')
    .trim(),

  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .trim(),

  body('assignee_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Assignee ID must be a positive integer'),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be "todo", "in-progress", or "done"'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be "low", "medium", or "high"'),

  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date in ISO 8601 format'),

  handleValidationErrors
];

export const validateTaskUpdate = [
  body('title')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Task title must be less than 255 characters')
    .trim(),

  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .trim(),

  body('assignee_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Assignee ID must be a positive integer'),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be "todo", "in-progress", or "done"'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be "low", "medium", or "high"'),

  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date in ISO 8601 format'),

  handleValidationErrors
];

export const validateTaskStatusUpdate = [
  body('status')
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be "todo", "in-progress", or "done"'),

  handleValidationErrors
];

export const validateTaskAssignment = [
  body('assignee_id')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Assignee ID must be a positive integer or null'),

  handleValidationErrors
];

// Comment validation rules
export const validateCommentCreation = [
  body('text')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment text is required and must be less than 1000 characters')
    .trim(),

  handleValidationErrors
];

export const validateCommentUpdate = [
  body('text')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment text is required and must be less than 1000 characters')
    .trim(),

  handleValidationErrors
];

// Parameter validation rules
export const validateIdParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),

  handleValidationErrors
];

export const validateProjectIdParam = [
  param('projectId')
    .isInt({ min: 1 })
    .withMessage('Project ID must be a positive integer'),

  handleValidationErrors
];

export const validateTaskIdParam = [
  param('taskId')
    .isInt({ min: 1 })
    .withMessage('Task ID must be a positive integer'),

  handleValidationErrors
];

// Query validation rules
export const validatePagination = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),

  handleValidationErrors
];