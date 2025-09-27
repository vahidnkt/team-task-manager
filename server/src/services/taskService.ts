import { Op } from "sequelize";
import { Task } from "../models/Task";
import { Project } from "../models/Project";
import { User } from "../models/User";
import { Comment } from "../models/Comment";
import { CreateTaskRequest, UpdateTaskRequest } from "../types/task.types";
import { HTTP_STATUS } from "../utils/constants";
import { logger } from "../utils/logger";
import { AppError } from "../types/common.types";
import { activityService } from "./activityService";

export class TaskService {
  // Create a new task
  async createTask(
    taskData: CreateTaskRequest,
    projectId: string,
    userId: string
  ): Promise<Task> {
    const { title, description, assignee_id, priority, due_date } = taskData;

    // Verify project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check if task with same title already exists in this project
    const existingTask = await Task.findOne({
      where: {
        projectId: projectId,
        title: title.trim(),
      },
    });

    if (existingTask) {
      const error = new Error(
        `Task with title "${title.trim()}" already exists in this project`
      ) as any;
      error.statusCode = HTTP_STATUS.CONFLICT;
      error.isOperational = true;
      throw error;
    }

    // Create task using Sequelize
    const task = await Task.create({
      projectId,
      title: title.trim(),
      description: description?.trim() || undefined,
      assigneeId: assignee_id || undefined,
      priority: priority || "medium",
      dueDate: due_date || undefined,
    } as any);

    // Log activity - task created
    try {
      await activityService.logTaskCreated(
        projectId,
        task.id,
        userId,
        task.title
      );
    } catch (activityError) {
      // Log activity error but don't fail the task creation
      logger.error(
        "Failed to log task creation activity",
        activityError as Error
      );
    }

    return task;
  }

  // Get all tasks with search and filter
  async getAllTasks(
    options: {
      search?: string;
      status?: string;
      priority?: string;
      assignee_id?: string;
      project_id?: string;
      limit?: number;
      offset?: number;
      sortBy?:
        | "title"
        | "status"
        | "priority"
        | "created_at"
        | "updated_at"
        | "due_date";
      sortOrder?: "ASC" | "DESC";
    } = {}
  ): Promise<{
    tasks: Task[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const {
      search = "",
      status,
      priority,
      assignee_id,
      project_id,
      limit = 10,
      offset = 0,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = options;

    // Build search conditions
    const searchConditions: any = {};

    if (search) {
      searchConditions[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) {
      searchConditions.status = status;
    }

    if (priority) {
      searchConditions.priority = priority;
    }

    if (assignee_id) {
      searchConditions.assigneeId = assignee_id;
    }

    if (project_id) {
      searchConditions.projectId = project_id;
    }

    // Get tasks with search and filter
    const { count, rows: tasks } = await Task.findAndCountAll({
      where: searchConditions,
      include: [
        { model: User, as: "assignee" },
        { model: Project, as: "project" },
      ],
      limit: Math.min(limit, 100), // Max 100 tasks per request
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      tasks,
      total: count,
      limit,
      offset,
    };
  }

  // Get all tasks in a project
  async getTasksByProject(
    projectId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Task[]> {
    const offset = (page - 1) * limit;
    return await Task.findAll({
      where: { projectId },
      include: [
        { model: User, as: "assignee" },
        { model: Project, as: "project" },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
  }

  // Get task by ID
  async getTaskById(id: string): Promise<Task | null> {
    return await Task.findByPk(id, {
      include: [
        { model: User, as: "assignee" },
        { model: Project, as: "project" },
        { model: Comment, as: "comments" },
      ],
    });
  }

  // Get tasks assigned to a user with search and filter
  async getTasksByAssignee(
    assigneeId: string,
    options: {
      search?: string;
      status?: string;
      priority?: string;
      project_id?: string;
      limit?: number;
      offset?: number;
      sortBy?:
        | "title"
        | "status"
        | "priority"
        | "created_at"
        | "updated_at"
        | "due_date";
      sortOrder?: "ASC" | "DESC";
    } = {}
  ): Promise<{
    tasks: Task[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const {
      search = "",
      status,
      priority,
      project_id,
      limit = 10,
      offset = 0,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = options;

    // Build search conditions
    const searchConditions: any = {
      assigneeId: assigneeId,
    };

    if (search) {
      searchConditions[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) {
      searchConditions.status = status;
    }

    if (priority) {
      searchConditions.priority = priority;
    }

    if (project_id) {
      searchConditions.projectId = project_id;
    }

    // Get tasks with search and filter
    const { count, rows: tasks } = await Task.findAndCountAll({
      where: searchConditions,
      include: [
        { model: User, as: "assignee" },
        { model: Project, as: "project" },
      ],
      limit: Math.min(limit, 100), // Max 100 tasks per request
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      tasks,
      total: count,
      limit,
      offset,
    };
  }

  // Get tasks by status
  async getTasksByStatus(status: string, projectId?: string): Promise<Task[]> {
    const whereCondition: any = { status };
    if (projectId) {
      whereCondition.projectId = projectId;
    }

    return await Task.findAll({
      where: whereCondition,
      include: [
        { model: User, as: "assignee" },
        { model: Project, as: "project" },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  // Update task
  async updateTask(
    id: string,
    updateData: UpdateTaskRequest,
    userId: string
  ): Promise<Task | null> {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    // Check if title is being updated and if it conflicts with existing task in the same project
    if (updateData.title && updateData.title.trim() !== task.title) {
      const existingTask = await Task.findOne({
        where: {
          projectId: task.projectId,
          title: updateData.title.trim(),
        },
      });

      if (existingTask && existingTask.id !== id) {
        const error = new Error(
          `Task with title "${updateData.title.trim()}" already exists in this project`
        ) as any;
        error.statusCode = HTTP_STATUS.CONFLICT;
        error.isOperational = true;
        throw error;
      }
    }

    await Task.update(updateData, { where: { id } });

    // Log activity - task updated
    try {
      await activityService.createActivity({
        project_id: task.projectId,
        task_id: task.id,
        user_id: userId,
        action: "task_updated",
        description: `Task '${task.title}' was updated`,
      });
    } catch (activityError) {
      // Log activity error but don't fail the task update
      logger.error(
        "Failed to log task update activity",
        activityError as Error
      );
    }

    return await this.getTaskById(id);
  }

  // Update task status
  async updateTaskStatus(
    id: string,
    status: string,
    userId: string
  ): Promise<Task | null> {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    const oldStatus = task.status;
    await Task.update({ status } as any, { where: { id } });

    // Log activity - status changed
    try {
      await activityService.logStatusChanged(
        task.projectId,
        task.id,
        userId,
        oldStatus,
        status
      );
    } catch (activityError) {
      // Log activity error but don't fail the status update
      logger.error(
        "Failed to log task status change activity",
        activityError as Error
      );
    }

    return await this.getTaskById(id);
  }

  // Assign task to user
  async assignTask(
    id: string,
    assigneeId: string | null,
    userId: string
  ): Promise<Task | null> {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    await Task.update({ assigneeId } as any, { where: { id } });

    // Log activity - task assigned
    try {
      if (assigneeId) {
        const assignee = await User.findByPk(assigneeId);
        await activityService.logTaskAssigned(
          task.projectId,
          task.id,
          userId,
          assignee?.username || "Unknown User"
        );
      } else {
        await activityService.createActivity({
          project_id: task.projectId,
          task_id: task.id,
          user_id: userId,
          action: "task_unassigned",
          description: `Task '${task.title}' was unassigned`,
        });
      }
    } catch (activityError) {
      // Log activity error but don't fail the assignment
      logger.error(
        "Failed to log task assignment activity",
        activityError as Error
      );
    }

    return await this.getTaskById(id);
  }

  // Delete task (soft delete)
  async deleteTask(id: string, userId: string): Promise<boolean> {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    await Task.destroy({ where: { id } });

    // Log activity - task deleted
    try {
      await activityService.createActivity({
        project_id: task.projectId,
        task_id: task.id,
        user_id: userId,
        action: "task_deleted",
        description: `Task '${task.title}' was deleted`,
      });
    } catch (activityError) {
      // Log activity error but don't fail the deletion
      logger.error(
        "Failed to log task deletion activity",
        activityError as Error
      );
    }

    return true;
  }

  // Get task statistics for a project
  async getProjectTaskStats(projectId: number): Promise<any> {
    const totalTasks = await Task.count({
      where: { projectId },
    });

    const completedTasks = await Task.count({
      where: { projectId, status: "done" },
    });

    const inProgressTasks = await Task.count({
      where: { projectId, status: "in-progress" },
    });

    const pendingTasks = await Task.count({
      where: { projectId, status: "todo" },
    });

    return {
      project_id: projectId,
      total_tasks: totalTasks,
      completed_tasks: completedTasks,
      in_progress_tasks: inProgressTasks,
      pending_tasks: pendingTasks,
      completion_percentage:
        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
  }

  // Get user task statistics
  async getUserTaskStats(userId: number): Promise<any> {
    const totalTasks = await Task.count({
      where: { assigneeId: userId },
    });

    const completedTasks = await Task.count({
      where: { assigneeId: userId, status: "done" },
    });

    const inProgressTasks = await Task.count({
      where: { assigneeId: userId, status: "in-progress" },
    });

    const pendingTasks = await Task.count({
      where: { assigneeId: userId, status: "todo" },
    });

    return {
      user_id: userId,
      total_tasks: totalTasks,
      completed_tasks: completedTasks,
      in_progress_tasks: inProgressTasks,
      pending_tasks: pendingTasks,
      completion_percentage:
        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
  }

  // Search tasks by title or description
  async searchTasks(
    searchTerm: string,
    projectId?: number,
    limit: number = 20
  ): Promise<Task[]> {
    const whereCondition: any = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${searchTerm}%` } },
        { description: { [Op.iLike]: `%${searchTerm}%` } },
      ],
    };

    if (projectId) {
      whereCondition.projectId = projectId;
    }

    return await Task.findAll({
      where: whereCondition,
      include: [
        { model: User, as: "assignee" },
        { model: Project, as: "project" },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    });
  }

  // Get tasks by priority
  async getTasksByPriority(
    priority: string,
    projectId?: number
  ): Promise<Task[]> {
    const whereCondition: any = { priority };
    if (projectId) {
      whereCondition.projectId = projectId;
    }

    return await Task.findAll({
      where: whereCondition,
      include: [
        { model: User, as: "assignee" },
        { model: Project, as: "project" },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  // Get overdue tasks
  async getOverdueTasks(projectId?: number): Promise<Task[]> {
    const whereCondition: any = {
      dueDate: {
        [Op.lt]: new Date(),
      },
      status: {
        [Op.ne]: "done",
      },
    };

    if (projectId) {
      whereCondition.projectId = projectId;
    }

    return await Task.findAll({
      where: whereCondition,
      include: [
        { model: User, as: "assignee" },
        { model: Project, as: "project" },
      ],
      order: [["dueDate", "ASC"]],
    });
  }

  // Get tasks due soon (within next 7 days)
  async getTasksDueSoon(projectId?: number): Promise<Task[]> {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const whereCondition: any = {
      dueDate: {
        [Op.between]: [new Date(), sevenDaysFromNow],
      },
      status: {
        [Op.ne]: "done",
      },
    };

    if (projectId) {
      whereCondition.projectId = projectId;
    }

    return await Task.findAll({
      where: whereCondition,
      include: [
        { model: User, as: "assignee" },
        { model: Project, as: "project" },
      ],
      order: [["dueDate", "ASC"]],
    });
  }

  // Check if task exists
  async taskExists(id: string): Promise<boolean> {
    const task = await this.getTaskById(id);
    return !!task;
  }

  // Get in-progress tasks
  async getInProgressTasks(params: {
    search?: string;
    priority?: string;
    assignee_id?: string;
    project_id?: string;
    limit: number;
    offset: number;
    sortBy: string;
    sortOrder: "ASC" | "DESC";
    userRole: string;
    userId: string;
  }): Promise<{
    tasks: any[];
    total: number;
    limit: number;
    offset: number;
  }> {
    try {
      const {
        search,
        priority,
        assignee_id,
        project_id,
        limit,
        offset,
        sortBy,
        sortOrder,
        userRole,
        userId,
      } = params;

      // Build where clause
      const whereClause: any = {
        status: "in-progress",
        deletedAt: null,
      };

      // Add search condition
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Add priority filter
      if (priority) {
        whereClause.priority = priority;
      }

      // Add assignee filter
      if (assignee_id) {
        whereClause.assigneeId = assignee_id;
      }

      // Add project filter
      if (project_id) {
        whereClause.projectId = project_id;
      }

      // For non-admin users, only show their assigned tasks
      if (userRole !== "admin") {
        whereClause.assigneeId = userId;
      }

      // Get total count
      const total = await Task.count({ where: whereClause });

      // Get tasks with pagination
      const tasks = await Task.findAll({
        where: whereClause,
        include: [
          { model: Project, as: "project" },
          { model: User, as: "assignee" },
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      return {
        tasks: tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate
            ? typeof task.dueDate === "string"
              ? task.dueDate
              : task.dueDate.toISOString()
            : undefined,
          projectId: task.projectId,
          projectName: task.project?.name || "Unknown Project",
          assigneeId: task.assigneeId,
          assigneeName: task.assignee?.username,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
        })),
        total,
        limit,
        offset,
      };
    } catch (error) {
      logger.error("Get in-progress tasks error", error as Error);
      const appError: AppError = new Error(
        "Failed to get in-progress tasks"
      ) as AppError;
      appError.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appError.isOperational = true;
      throw appError;
    }
  }

  // Get completed tasks
  async getCompletedTasks(params: {
    search?: string;
    priority?: string;
    assignee_id?: string;
    project_id?: string;
    limit: number;
    offset: number;
    sortBy: string;
    sortOrder: "ASC" | "DESC";
    userRole: string;
    userId: string;
  }): Promise<{
    tasks: any[];
    total: number;
    limit: number;
    offset: number;
  }> {
    try {
      const {
        search,
        priority,
        assignee_id,
        project_id,
        limit,
        offset,
        sortBy,
        sortOrder,
        userRole,
        userId,
      } = params;

      // Build where clause
      const whereClause: any = {
        status: "done",
        deletedAt: null,
      };

      // Add search condition
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Add priority filter
      if (priority) {
        whereClause.priority = priority;
      }

      // Add assignee filter
      if (assignee_id) {
        whereClause.assigneeId = assignee_id;
      }

      // Add project filter
      if (project_id) {
        whereClause.projectId = project_id;
      }

      // For non-admin users, only show their assigned tasks
      if (userRole !== "admin") {
        whereClause.assigneeId = userId;
      }

      // Get total count
      const total = await Task.count({ where: whereClause });

      // Get tasks with pagination
      const tasks = await Task.findAll({
        where: whereClause,
        include: [
          { model: Project, as: "project" },
          { model: User, as: "assignee" },
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      return {
        tasks: tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate
            ? typeof task.dueDate === "string"
              ? task.dueDate
              : task.dueDate.toISOString()
            : undefined,
          projectId: task.projectId,
          projectName: task.project?.name || "Unknown Project",
          assigneeId: task.assigneeId,
          assigneeName: task.assignee?.username,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
        })),
        total,
        limit,
        offset,
      };
    } catch (error) {
      logger.error("Get completed tasks error", error as Error);
      const appError: AppError = new Error(
        "Failed to get completed tasks"
      ) as AppError;
      appError.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appError.isOperational = true;
      throw appError;
    }
  }
}

export const taskService = new TaskService();
