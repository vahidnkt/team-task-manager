import { Request, Response } from "express";
import { taskService } from "../services/taskService";
import { AuthRequest } from "../types/auth.types";
import { ApiResponse } from "../types/api.types";
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStatus,
  TaskPriority,
} from "../types/task.types";
import { HTTP_STATUS } from "../utils/constants";

export class TaskController {
  // Get all tasks in a project
  async getTasksByProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;

      if (!projectId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      const tasks = await taskService.getTasksByProject(projectId);

      const response: ApiResponse = {
        success: true,
        data: tasks,
        message: "Tasks retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to retrieve tasks",
      });
    }
  }

  // Create new task
  async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;

      if (!projectId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      const taskData: CreateTaskRequest = {
        ...req.body,
        project_id: projectId,
      };

      const newTask = await taskService.createTask(taskData, projectId);

      const response: ApiResponse = {
        success: true,
        data: newTask,
        message: "Task created successfully",
      };
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create task",
      });
    }
  }

  // Get specific task by ID
  async getTaskById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const task = await taskService.getTaskById(id);

      if (!task) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: task,
        message: "Task retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to retrieve task",
      });
    }
  }

  // Update task
  async updateTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateTaskRequest = req.body;

      if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const updatedTask = await taskService.updateTask(id, updateData);

      if (!updatedTask) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: updatedTask,
        message: "Task updated successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update task",
      });
    }
  }

  // Delete task
  async deleteTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const deleted = await taskService.deleteTask(id);

      if (!deleted) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "Task deleted successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete task",
      });
    }
  }

  // Update task status
  async updateTaskStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status }: { status: TaskStatus } = req.body;

      if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      if (!["todo", "in-progress", "done"].includes(status)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Invalid status. Must be: todo, in-progress, or done",
        });
        return;
      }

      const updatedTask = await taskService.updateTaskStatus(id, status);

      if (!updatedTask) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: updatedTask,
        message: "Task status updated successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update task status",
      });
    }
  }

  // Assign/unassign task
  async assignTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { assignee_id }: { assignee_id: number | null } = req.body;

      if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const updatedTask = await taskService.assignTask(
        id,
        assignee_id?.toString() || null
      );

      if (!updatedTask) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: updatedTask,
        message: assignee_id
          ? "Task assigned successfully"
          : "Task unassigned successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to assign task",
      });
    }
  }

  // Get tasks assigned to current user
  async getMyTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const tasks = await taskService.getTasksByAssignee(req.user.userId);

      const response: ApiResponse = {
        success: true,
        data: tasks,
        message: "User tasks retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve user tasks",
      });
    }
  }

  // Get tasks by status
  async getTasksByStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status } = req.query;
      const { projectId } = req.params;

      if (!projectId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      if (
        !status ||
        !["todo", "in-progress", "done"].includes(status as string)
      ) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Invalid or missing status parameter",
        });
        return;
      }

      const tasks = await taskService.getTasksByStatus(
        projectId,
        status as TaskStatus
      );

      const response: ApiResponse = {
        success: true,
        data: tasks,
        message: "Tasks retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve tasks by status",
      });
    }
  }
}

export const taskController = new TaskController();
