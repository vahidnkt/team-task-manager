import { TaskModel } from "../models/Task";
import { userService } from "./userService";
import { projectService } from "./projectService";
import { activityService } from "./activityService";
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStatus,
  TaskPriority,
} from "../types/task.types";

export class TaskService {
  // Get all tasks for a project
  async getTasksByProject(projectId: number): Promise<Task[]> {
    return await TaskModel.findByProject(projectId);
  }

  // Get task by ID
  async getTaskById(id: number): Promise<Task | null> {
    return await TaskModel.findById(id);
  }

  // Create new task
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const {
      project_id,
      title,
      description,
      assignee_id,
      status = "todo",
      priority = "medium",
      due_date,
    } = taskData;

    // Validate required fields
    if (!title || !project_id) {
      throw new Error("Task title and project ID are required");
    }

    // Validate project exists
    const project = await projectService.getProjectById(project_id);
    if (!project) {
      throw new Error("Project not found");
    }

    // Validate assignee if provided
    if (assignee_id) {
      const assignee = await userService.getUserById(assignee_id);
      if (!assignee) {
        throw new Error("Assignee not found");
      }
    }

    // Create task
    const newTask = await TaskModel.create({
      project_id,
      title: title.trim(),
      description: description?.trim() || null,
      assignee_id: assignee_id || null,
      status,
      priority,
      due_date: due_date || null,
    });

    // Log activity
    await activityService.logTaskCreated(
      project_id,
      newTask.id,
      project.created_by,
      title
    );

    // Log assignment if task is created with an assignee
    if (assignee_id) {
      const assignee = await userService.getUserById(assignee_id);
      if (assignee) {
        await activityService.logTaskAssigned(
          project_id,
          newTask.id,
          project.created_by,
          assignee.username
        );
      }
    }

    return newTask;
  }

  // Update task
  async updateTask(
    id: number,
    updateData: UpdateTaskRequest
  ): Promise<Task | null> {
    const existingTask = await this.getTaskById(id);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    // Validate assignee if being updated
    if (
      updateData.assignee_id !== undefined &&
      updateData.assignee_id !== null
    ) {
      const assignee = await userService.getUserById(updateData.assignee_id);
      if (!assignee) {
        throw new Error("Assignee not found");
      }
    }

    // Prepare update data
    const cleanUpdateData: any = {};
    if (updateData.title !== undefined) {
      cleanUpdateData.title = updateData.title.trim();
    }
    if (updateData.description !== undefined) {
      cleanUpdateData.description = updateData.description?.trim() || null;
    }
    if (updateData.assignee_id !== undefined) {
      cleanUpdateData.assignee_id = updateData.assignee_id;
    }
    if (updateData.status !== undefined) {
      cleanUpdateData.status = updateData.status;
    }
    if (updateData.priority !== undefined) {
      cleanUpdateData.priority = updateData.priority;
    }
    if (updateData.due_date !== undefined) {
      cleanUpdateData.due_date = updateData.due_date;
    }

    const updatedTask = await TaskModel.update(id, cleanUpdateData);

    // Log relevant activities
    if (updatedTask) {
      // Log status change
      if (updateData.status && updateData.status !== existingTask.status) {
        await activityService.logStatusChanged(
          existingTask.project_id,
          id,
          updatedTask.assignee_id || existingTask.assignee_id || 1, // Default to user 1 if no assignee
          existingTask.status,
          updateData.status
        );
      }

      // Log assignment change
      if (
        updateData.assignee_id !== undefined &&
        updateData.assignee_id !== existingTask.assignee_id
      ) {
        if (updateData.assignee_id) {
          const assignee = await userService.getUserById(
            updateData.assignee_id
          );
          if (assignee) {
            await activityService.logTaskAssigned(
              existingTask.project_id,
              id,
              assignee.id,
              assignee.username
            );
          }
        } else {
          await activityService.logTaskUnassigned(
            existingTask.project_id,
            id,
            1
          ); // Default user
        }
      }
    }

    return updatedTask;
  }

  // Delete task
  async deleteTask(id: number): Promise<boolean> {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    const deleted = await TaskModel.delete(id);

    // Log activity
    if (deleted) {
      await activityService.logTaskDeleted(
        task.project_id,
        id,
        task.assignee_id || 1,
        task.title
      );
    }

    return deleted;
  }

  // Update task status
  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task | null> {
    const existingTask = await this.getTaskById(id);
    if (!existingTask) {
      return null;
    }

    const updatedTask = await TaskModel.updateStatus(id, status);

    // Log activity
    if (updatedTask) {
      await activityService.logStatusChanged(
        existingTask.project_id,
        id,
        updatedTask.assignee_id || 1,
        existingTask.status,
        status
      );
    }

    return updatedTask;
  }

  // Assign task to user
  async assignTask(
    id: number,
    assigneeId: number | null
  ): Promise<Task | null> {
    const existingTask = await this.getTaskById(id);
    if (!existingTask) {
      return null;
    }

    // Validate assignee if provided
    if (assigneeId) {
      const assignee = await userService.getUserById(assigneeId);
      if (!assignee) {
        throw new Error("Assignee not found");
      }
    }

    const updatedTask = await TaskModel.assign(id, assigneeId);

    // Log activity
    if (updatedTask) {
      if (assigneeId) {
        const assignee = await userService.getUserById(assigneeId);
        if (assignee) {
          await activityService.logTaskAssigned(
            existingTask.project_id,
            id,
            assignee.id,
            assignee.username
          );
        }
      } else {
        await activityService.logTaskUnassigned(existingTask.project_id, id, 1);
      }
    }

    return updatedTask;
  }

  // Get tasks assigned to a user
  async getTasksByAssignee(assigneeId: number): Promise<Task[]> {
    return await TaskModel.findByAssignee(assigneeId);
  }

  // Get tasks by status
  async getTasksByStatus(
    projectId: number,
    status: TaskStatus
  ): Promise<Task[]> {
    return await TaskModel.findByStatus(projectId, status);
  }

  // Get tasks by priority
  async getTasksByPriority(
    projectId: number,
    priority: TaskPriority
  ): Promise<Task[]> {
    return await TaskModel.findByPriority(projectId, priority);
  }

  // Get overdue tasks
  async getOverdueTasks(projectId?: number): Promise<Task[]> {
    return await TaskModel.findOverdue(projectId);
  }

  // Get tasks due soon (within specified days)
  async getTasksDueSoon(days: number = 7, projectId?: number): Promise<Task[]> {
    return await TaskModel.findDueSoon(days, projectId);
  }

  // Search tasks by title or description
  async searchTasks(
    searchTerm: string,
    projectId?: number,
    limit: number = 20
  ): Promise<Task[]> {
    return await TaskModel.searchByTitleOrDescription(
      searchTerm,
      projectId,
      limit
    );
  }

  // Get task statistics for a project
  async getProjectTaskStats(projectId: number): Promise<any> {
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const stats = await TaskModel.getProjectTaskStats(projectId);

    return {
      project_id: projectId,
      project_name: project.name,
      ...stats,
      completion_percentage:
        stats.total_tasks > 0
          ? Math.round((stats.done_tasks / stats.total_tasks) * 100)
          : 0,
    };
  }

  // Get user task statistics
  async getUserTaskStats(userId: number): Promise<any> {
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const stats = await TaskModel.getUserTaskStats(userId);

    return {
      user_id: userId,
      username: user.username,
      ...stats,
    };
  }

  // Check if user can modify task
  async canUserModifyTask(
    taskId: number,
    userId: number,
    userRole: string
  ): Promise<boolean> {
    // Admin can modify all tasks
    if (userRole === "admin") {
      return true;
    }

    const task = await this.getTaskById(taskId);
    if (!task) {
      return false;
    }

    // Task assignee can modify
    if (task.assignee_id === userId) {
      return true;
    }

    // Project creator can modify
    const project = await projectService.getProjectById(task.project_id);
    if (project && project.created_by === userId) {
      return true;
    }

    return false;
  }

  // Duplicate task
  async duplicateTask(taskId: number, newTitle?: string): Promise<Task> {
    const originalTask = await this.getTaskById(taskId);
    if (!originalTask) {
      throw new Error("Original task not found");
    }

    const duplicateData: CreateTaskRequest = {
      project_id: originalTask.project_id,
      title: newTitle || `Copy of ${originalTask.title}`,
      description: originalTask.description,
      assignee_id: null, // Don't copy assignment
      status: "todo", // Reset status
      priority: originalTask.priority,
      due_date: originalTask.due_date,
    };

    return await this.createTask(duplicateData);
  }

  // Move task to different project
  async moveTaskToProject(
    taskId: number,
    newProjectId: number,
    userId: number
  ): Promise<Task | null> {
    const task = await this.getTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const newProject = await projectService.getProjectById(newProjectId);
    if (!newProject) {
      throw new Error("Target project not found");
    }

    const updatedTask = await TaskModel.update(taskId, {
      project_id: newProjectId,
    });

    // Log activity in both projects
    if (updatedTask) {
      await activityService.logTaskMoved(
        task.project_id,
        newProjectId,
        taskId,
        userId,
        task.title
      );
    }

    return updatedTask;
  }

  // Get task history (would require activity logs)
  async getTaskHistory(taskId: number): Promise<any[]> {
    const task = await this.getTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    return await activityService.getTaskActivities(taskId);
  }

  // Validate task data
  private validateTaskData(data: CreateTaskRequest | UpdateTaskRequest): void {
    if ("title" in data && (!data.title || data.title.trim().length === 0)) {
      throw new Error("Task title is required");
    }

    if ("title" in data && data.title.trim().length > 255) {
      throw new Error("Task title must be less than 255 characters");
    }

    if (
      "description" in data &&
      data.description &&
      data.description.length > 1000
    ) {
      throw new Error("Task description must be less than 1000 characters");
    }

    if (
      "status" in data &&
      data.status &&
      !["todo", "in-progress", "done"].includes(data.status)
    ) {
      throw new Error("Invalid task status");
    }

    if (
      "priority" in data &&
      data.priority &&
      !["low", "medium", "high"].includes(data.priority)
    ) {
      throw new Error("Invalid task priority");
    }
  }
}

export const taskService = new TaskService();
