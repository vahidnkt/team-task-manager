import { Request, Response, NextFunction } from "express";
import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { HTTP_STATUS } from "../utils/constants";
import { logger } from "../utils/logger";

/**
 * Middleware to check if a project is completed before allowing task operations
 * This prevents task completion/updates when the project is already completed
 */
export const checkProjectStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: taskId } = req.params;
    const { status } = req.body;

    // Only check for task completion/status updates
    if (!status || status !== "done") {
      return next();
    }

    if (!taskId) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Task ID is required",
      });
      return;
    }

    // Get the task to find its project
    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["id", "name", "status"],
        },
      ],
    });

    if (!task) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    // Check if the project is completed
    if (task.project?.status === "completed") {
      logger.warn("Attempt to complete task in completed project", {
        taskId,
        projectId: task.project.id,
        projectName: task.project.name,
        userId: (req as any).user?.userId,
      });

      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `Cannot complete task "${task.title}" because the project "${task.project.name}" is already completed`,
      });
      return;
    }

    // Project is not completed, allow the operation
    next();
  } catch (error) {
    logger.error("Error checking project status", error as Error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to validate project status",
    });
  }
};

/**
 * Middleware to check project status for task creation
 * This prevents creating new tasks in completed projects
 */
export const checkProjectStatusForCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Project ID is required",
      });
      return;
    }

    // Get the project to check its status
    const project = await Project.findByPk(projectId, {
      attributes: ["id", "name", "status"],
    });

    if (!project) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    // Check if the project is completed
    if (project.status === "completed") {
      logger.warn("Attempt to create task in completed project", {
        projectId,
        projectName: project.name,
        userId: (req as any).user?.userId,
      });

      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `Cannot create new tasks in project "${project.name}" because it is already completed`,
      });
      return;
    }

    // Project is not completed, allow the operation
    next();
  } catch (error) {
    logger.error("Error checking project status for creation", error as Error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to validate project status",
    });
  }
};

/**
 * Middleware to check project status for task updates
 * This prevents updating tasks in completed projects
 */
export const checkProjectStatusForUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: taskId } = req.params;

    if (!taskId) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Task ID is required",
      });
      return;
    }

    // Get the task to find its project
    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["id", "name", "status"],
        },
      ],
    });

    if (!task) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    // Check if the project is completed
    if (task.project?.status === "completed") {
      logger.warn("Attempt to update task in completed project", {
        taskId,
        projectId: task.project.id,
        projectName: task.project.name,
        userId: (req as any).user?.userId,
      });

      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `Cannot update task "${task.title}" because the project "${task.project.name}" is already completed`,
      });
      return;
    }

    // Project is not completed, allow the operation
    next();
  } catch (error) {
    logger.error("Error checking project status for update", error as Error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to validate project status",
    });
  }
};
