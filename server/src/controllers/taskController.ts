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

export class TaskController {
  // Get all tasks in a project
  async getTasksByProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;

      if (!projectId) {
        res.status(400).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      const tasks = await taskService.getTasksByProject(parseInt(projectId));

      const response: ApiResponse = {
        success: true,
        data: tasks,
        message: "Tasks retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
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
        res.status(400).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      const taskData: CreateTaskRequest = {
        ...req.body,
        project_id: parseInt(projectId),
      };

      const newTask = await taskService.createTask(taskData);

      const response: ApiResponse = {
        success: true,
        data: newTask,
        message: "Task created successfully",
      };
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
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
        res.status(400).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const task = await taskService.getTaskById(parseInt(id));

      if (!task) {
        res.status(404).json({
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
      res.json(response);
    } catch (error) {
      res.status(500).json({
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
        res.status(400).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const updatedTask = await taskService.updateTask(
        parseInt(id),
        updateData
      );

      if (!updatedTask) {
        res.status(404).json({
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
      res.json(response);
    } catch (error) {
      res.status(500).json({
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
        res.status(400).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const deleted = await taskService.deleteTask(parseInt(id));

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Task not found",
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "Task deleted successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
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
        res.status(400).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      if (!["todo", "in-progress", "done"].includes(status)) {
        res.status(400).json({
          success: false,
          message: "Invalid status. Must be: todo, in-progress, or done",
        });
        return;
      }

      const updatedTask = await taskService.updateTaskStatus(
        parseInt(id),
        status
      );

      if (!updatedTask) {
        res.status(404).json({
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
      res.json(response);
    } catch (error) {
      res.status(500).json({
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
        res.status(400).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const updatedTask = await taskService.assignTask(
        parseInt(id),
        assignee_id
      );

      if (!updatedTask) {
        res.status(404).json({
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
      res.json(response);
    } catch (error) {
      res.status(500).json({
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
        res.status(401).json({
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
      res.json(response);
    } catch (error) {
      res.status(500).json({
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
        res.status(400).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      if (
        !status ||
        !["todo", "in-progress", "done"].includes(status as string)
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid or missing status parameter",
        });
        return;
      }

      const tasks = await taskService.getTasksByStatus(
        parseInt(projectId),
        status as TaskStatus
      );

      const response: ApiResponse = {
        success: true,
        data: tasks,
        message: "Tasks retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
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
