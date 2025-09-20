/**
 * Custom validation functions for the task manager application
 */

import { VALIDATION_RULES, REGEX } from "./constants";
import { userService } from "../services/userService";
import { projectService } from "../services/projectService";
import { taskService } from "../services/taskService";

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Create a validation result
function createValidationResult(
  isValid: boolean,
  errors: string[] = []
): ValidationResult {
  return { isValid, errors };
}

// User validation functions
export class UserValidators {
  // Validate username format
  static validateUsername(username: string): ValidationResult {
    const errors: string[] = [];

    if (!username) {
      errors.push("Username is required");
    } else {
      if (username.length < VALIDATION_RULES.USERNAME.MIN_LENGTH) {
        errors.push(
          `Username must be at least ${VALIDATION_RULES.USERNAME.MIN_LENGTH} characters long`
        );
      }

      if (username.length > VALIDATION_RULES.USERNAME.MAX_LENGTH) {
        errors.push(
          `Username must be no more than ${VALIDATION_RULES.USERNAME.MAX_LENGTH} characters long`
        );
      }

      if (!VALIDATION_RULES.USERNAME.PATTERN.test(username)) {
        errors.push(
          "Username can only contain letters, numbers, and underscores"
        );
      }
    }

    return createValidationResult(errors.length === 0, errors);
  }

  // Validate email format
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];

    if (!email) {
      errors.push("Email is required");
    } else {
      if (email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
        errors.push(
          `Email must be no more than ${VALIDATION_RULES.EMAIL.MAX_LENGTH} characters long`
        );
      }

      if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
        errors.push("Please provide a valid email address");
      }
    }

    return createValidationResult(errors.length === 0, errors);
  }

  // Validate password strength
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password) {
      errors.push("Password is required");
    } else {
      if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
        errors.push(
          `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters long`
        );
      }

      if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
        errors.push(
          "Password must contain at least one lowercase letter, one uppercase letter, and one number"
        );
      }

      // Additional password strength checks
      if (password.length < 8) {
        errors.push(
          "Password should be at least 8 characters for better security"
        );
      }

      // Check for common patterns
      if (/(.)\1{2,}/.test(password)) {
        errors.push("Password should not contain repeated characters");
      }

      if (/123|abc|qwe|password|admin|user/i.test(password)) {
        errors.push("Password should not contain common patterns or words");
      }
    }

    return createValidationResult(errors.length === 0, errors);
  }

  // Validate user role
  static validateRole(role: string): ValidationResult {
    const validRoles = ["user", "admin"];
    const isValid = validRoles.includes(role);
    const errors = isValid
      ? []
      : [`Role must be one of: ${validRoles.join(", ")}`];

    return createValidationResult(isValid, errors);
  }

  // Validate username uniqueness (async)
  static async validateUsernameUniqueness(
    username: string,
    excludeUserId?: string
  ): Promise<ValidationResult> {
    try {
      const existingUser = await userService.getUserByUsername(username);

      if (
        existingUser &&
        (!excludeUserId || existingUser.id !== excludeUserId)
      ) {
        return createValidationResult(false, ["Username is already taken"]);
      }

      return createValidationResult(true);
    } catch (error) {
      return createValidationResult(false, [
        "Unable to validate username uniqueness",
      ]);
    }
  }

  // Validate email uniqueness (async)
  static async validateEmailUniqueness(
    email: string,
    excludeUserId?: string
  ): Promise<ValidationResult> {
    try {
      const existingUser = await userService.getUserByEmail(email);

      if (
        existingUser &&
        (!excludeUserId || existingUser.id !== excludeUserId)
      ) {
        return createValidationResult(false, ["Email is already in use"]);
      }

      return createValidationResult(true);
    } catch (error) {
      return createValidationResult(false, [
        "Unable to validate email uniqueness",
      ]);
    }
  }
}

// Project validation functions
export class ProjectValidators {
  // Validate project name
  static validateName(name: string): ValidationResult {
    const errors: string[] = [];

    if (!name || !name.trim()) {
      errors.push("Project name is required");
    } else {
      const trimmedName = name.trim();

      if (trimmedName.length < VALIDATION_RULES.PROJECT_NAME.MIN_LENGTH) {
        errors.push("Project name cannot be empty");
      }

      if (trimmedName.length > VALIDATION_RULES.PROJECT_NAME.MAX_LENGTH) {
        errors.push(
          `Project name must be no more than ${VALIDATION_RULES.PROJECT_NAME.MAX_LENGTH} characters long`
        );
      }

      // Check for special characters that might cause issues
      if (/[<>:"/\\|?*]/.test(trimmedName)) {
        errors.push("Project name contains invalid characters");
      }
    }

    return createValidationResult(errors.length === 0, errors);
  }

  // Validate project description
  static validateDescription(description: string | null): ValidationResult {
    const errors: string[] = [];

    if (
      description !== null &&
      description.length > VALIDATION_RULES.PROJECT_DESCRIPTION.MAX_LENGTH
    ) {
      errors.push(
        `Project description must be no more than ${VALIDATION_RULES.PROJECT_DESCRIPTION.MAX_LENGTH} characters long`
      );
    }

    return createValidationResult(errors.length === 0, errors);
  }

  // Validate project creator exists (async)
  static async validateCreatorExists(
    creatorId: string
  ): Promise<ValidationResult> {
    try {
      const creator = await userService.getUserById(creatorId);

      if (!creator) {
        return createValidationResult(false, [
          "Project creator does not exist",
        ]);
      }

      return createValidationResult(true);
    } catch (error) {
      return createValidationResult(false, [
        "Unable to validate project creator",
      ]);
    }
  }

  // Validate project exists (async)
  static async validateProjectExists(
    projectId: string
  ): Promise<ValidationResult> {
    try {
      const project = await projectService.getProjectById(projectId);

      if (!project) {
        return createValidationResult(false, ["Project does not exist"]);
      }

      return createValidationResult(true);
    } catch (error) {
      return createValidationResult(false, [
        "Unable to validate project existence",
      ]);
    }
  }
}

// Task validation functions
export class TaskValidators {
  // Validate task title
  static validateTitle(title: string): ValidationResult {
    const errors: string[] = [];

    if (!title || !title.trim()) {
      errors.push("Task title is required");
    } else {
      const trimmedTitle = title.trim();

      if (trimmedTitle.length < VALIDATION_RULES.TASK_TITLE.MIN_LENGTH) {
        errors.push("Task title cannot be empty");
      }

      if (trimmedTitle.length > VALIDATION_RULES.TASK_TITLE.MAX_LENGTH) {
        errors.push(
          `Task title must be no more than ${VALIDATION_RULES.TASK_TITLE.MAX_LENGTH} characters long`
        );
      }
    }

    return createValidationResult(errors.length === 0, errors);
  }

  // Validate task description
  static validateDescription(description: string | null): ValidationResult {
    const errors: string[] = [];

    if (
      description !== null &&
      description.length > VALIDATION_RULES.TASK_DESCRIPTION.MAX_LENGTH
    ) {
      errors.push(
        `Task description must be no more than ${VALIDATION_RULES.TASK_DESCRIPTION.MAX_LENGTH} characters long`
      );
    }

    return createValidationResult(errors.length === 0, errors);
  }

  // Validate task status
  static validateStatus(status: string): ValidationResult {
    const validStatuses = ["todo", "in-progress", "done"];
    const isValid = validStatuses.includes(status);
    const errors = isValid
      ? []
      : [`Task status must be one of: ${validStatuses.join(", ")}`];

    return createValidationResult(isValid, errors);
  }

  // Validate task priority
  static validatePriority(priority: string): ValidationResult {
    const validPriorities = ["low", "medium", "high"];
    const isValid = validPriorities.includes(priority);
    const errors = isValid
      ? []
      : [`Task priority must be one of: ${validPriorities.join(", ")}`];

    return createValidationResult(isValid, errors);
  }

  // Validate due date
  static validateDueDate(dueDate: string | null): ValidationResult {
    const errors: string[] = [];

    if (dueDate !== null) {
      const date = new Date(dueDate);

      if (isNaN(date.getTime())) {
        errors.push("Invalid due date format");
      } else {
        // Check if date is not too far in the past (more than 1 day)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (date < oneDayAgo) {
          errors.push("Due date cannot be in the past");
        }

        // Check if date is not too far in the future (more than 10 years)
        const tenYearsFromNow = new Date(
          Date.now() + 10 * 365 * 24 * 60 * 60 * 1000
        );
        if (date > tenYearsFromNow) {
          errors.push("Due date cannot be more than 10 years in the future");
        }
      }
    }

    return createValidationResult(errors.length === 0, errors);
  }

  // Validate assignee exists (async)
  static async validateAssigneeExists(
    assigneeId: string | null
  ): Promise<ValidationResult> {
    if (assigneeId === null) {
      return createValidationResult(true); // Null assignee is valid (unassigned task)
    }

    try {
      const assignee = await userService.getUserById(assigneeId);

      if (!assignee) {
        return createValidationResult(false, ["Assigned user does not exist"]);
      }

      return createValidationResult(true);
    } catch (error) {
      return createValidationResult(false, ["Unable to validate assignee"]);
    }
  }

  // Validate task exists (async)
  static async validateTaskExists(taskId: string): Promise<ValidationResult> {
    try {
      const task = await taskService.getTaskById(taskId);

      if (!task) {
        return createValidationResult(false, ["Task does not exist"]);
      }

      return createValidationResult(true);
    } catch (error) {
      return createValidationResult(false, [
        "Unable to validate task existence",
      ]);
    }
  }
}

// Comment validation functions
export class CommentValidators {
  // Validate comment text
  static validateText(text: string): ValidationResult {
    const errors: string[] = [];

    if (!text || !text.trim()) {
      errors.push("Comment text is required");
    } else {
      const trimmedText = text.trim();

      if (trimmedText.length < VALIDATION_RULES.COMMENT_TEXT.MIN_LENGTH) {
        errors.push("Comment text cannot be empty");
      }

      if (trimmedText.length > VALIDATION_RULES.COMMENT_TEXT.MAX_LENGTH) {
        errors.push(
          `Comment text must be no more than ${VALIDATION_RULES.COMMENT_TEXT.MAX_LENGTH} characters long`
        );
      }

      // Check for potentially harmful content
      if (/<script|javascript:|on\w+=/i.test(trimmedText)) {
        errors.push("Comment text contains potentially harmful content");
      }
    }

    return createValidationResult(errors.length === 0, errors);
  }
}

// General validation functions
export class GeneralValidators {
  // Validate ID parameter (UUID format)
  static validateId(id: any): ValidationResult {
    const errors: string[] = [];

    if (id === null || id === undefined) {
      errors.push("ID is required");
    } else {
      const stringId = String(id);

      if (!REGEX.UUID.test(stringId)) {
        errors.push("ID must be a valid UUID");
      }
    }

    return createValidationResult(errors.length === 0, errors);
  }

  // Validate pagination parameters
  static validatePagination(limit?: any, offset?: any): ValidationResult {
    const errors: string[] = [];

    if (limit !== undefined) {
      const numLimit = Number(limit);

      if (isNaN(numLimit) || !Number.isInteger(numLimit) || numLimit <= 0) {
        errors.push("Limit must be a positive integer");
      } else if (numLimit > 100) {
        errors.push("Limit cannot exceed 100");
      }
    }

    if (offset !== undefined) {
      const numOffset = Number(offset);

      if (isNaN(numOffset) || !Number.isInteger(numOffset) || numOffset < 0) {
        errors.push("Offset must be a non-negative integer");
      }
    }

    return createValidationResult(errors.length === 0, errors);
  }

  // Validate URL
  static validateUrl(url: string): ValidationResult {
    const errors: string[] = [];

    if (!url) {
      errors.push("URL is required");
    } else {
      if (!REGEX.URL.test(url)) {
        errors.push("Please provide a valid URL");
      }

      // Additional URL security checks
      if (url.includes("javascript:") || url.includes("data:")) {
        errors.push("URL contains potentially harmful protocol");
      }
    }

    return createValidationResult(errors.length === 0, errors);
  }

  // Validate file upload (for future enhancement)
  static validateFileUpload(file: any): ValidationResult {
    const errors: string[] = [];

    if (!file) {
      errors.push("File is required");
    } else {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        errors.push("File size cannot exceed 5MB");
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "text/plain",
      ];

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push("File type not allowed");
      }

      // Check filename
      if (!/^[a-zA-Z0-9._-]+$/.test(file.originalname)) {
        errors.push("Filename contains invalid characters");
      }
    }

    return createValidationResult(errors.length === 0, errors);
  }
}

// Composite validation functions
export class CompositeValidators {
  // Validate complete user registration
  static async validateUserRegistration(userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<ValidationResult> {
    const errors: string[] = [];

    // Validate individual fields
    const usernameResult = UserValidators.validateUsername(userData.username);
    const emailResult = UserValidators.validateEmail(userData.email);
    const passwordResult = UserValidators.validatePassword(userData.password);

    errors.push(...usernameResult.errors);
    errors.push(...emailResult.errors);
    errors.push(...passwordResult.errors);

    if (userData.role) {
      const roleResult = UserValidators.validateRole(userData.role);
      errors.push(...roleResult.errors);
    }

    // Validate uniqueness (only if basic validation passes)
    if (usernameResult.isValid) {
      const usernameUniquenessResult =
        await UserValidators.validateUsernameUniqueness(userData.username);
      errors.push(...usernameUniquenessResult.errors);
    }

    if (emailResult.isValid) {
      const emailUniquenessResult =
        await UserValidators.validateEmailUniqueness(userData.email);
      errors.push(...emailUniquenessResult.errors);
    }

    return createValidationResult(errors.length === 0, errors);
  }

  // Validate complete task creation
  static async validateTaskCreation(taskData: {
    title: string;
    description?: string;
    project_id: string;
    assignee_id?: string;
    status?: string;
    priority?: string;
    due_date?: string;
  }): Promise<ValidationResult> {
    const errors: string[] = [];

    // Validate individual fields
    const titleResult = TaskValidators.validateTitle(taskData.title);
    const descriptionResult = TaskValidators.validateDescription(
      taskData.description || null
    );
    const projectIdResult = GeneralValidators.validateId(taskData.project_id);

    errors.push(...titleResult.errors);
    errors.push(...descriptionResult.errors);
    errors.push(...projectIdResult.errors);

    if (taskData.status) {
      const statusResult = TaskValidators.validateStatus(taskData.status);
      errors.push(...statusResult.errors);
    }

    if (taskData.priority) {
      const priorityResult = TaskValidators.validatePriority(taskData.priority);
      errors.push(...priorityResult.errors);
    }

    if (taskData.due_date) {
      const dueDateResult = TaskValidators.validateDueDate(taskData.due_date);
      errors.push(...dueDateResult.errors);
    }

    // Validate related entities existence (only if IDs are valid)
    if (projectIdResult.isValid) {
      const projectExistsResult = await ProjectValidators.validateProjectExists(
        taskData.project_id
      );
      errors.push(...projectExistsResult.errors);
    }

    if (taskData.assignee_id) {
      const assigneeExistsResult = await TaskValidators.validateAssigneeExists(
        taskData.assignee_id
      );
      errors.push(...assigneeExistsResult.errors);
    }

    return createValidationResult(errors.length === 0, errors);
  }
}

// Export all validators
export const validators = {
  user: UserValidators,
  project: ProjectValidators,
  task: TaskValidators,
  comment: CommentValidators,
  general: GeneralValidators,
  composite: CompositeValidators,
};

export default validators;
