import { Task } from "../models/Task";
import { Project } from "../models/Project";
import { CreateTaskRequest, UpdateTaskRequest } from "../types/task.types";

export class TaskService {
  // Create a new task
  async createTask(
    taskData: CreateTaskRequest,
    projectId: string
  ): Promise<Task> {
    const { title, description, assignee_id, priority, due_date } = taskData;

    // Verify project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Create task using Sequelize
    return await Task.create({
      projectId,
      title: title.trim(),
      description: description?.trim() || undefined,
      assigneeId: assignee_id || undefined,
      priority: priority || "medium",
      dueDate: due_date || undefined,
    } as any);
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
        { model: require("../models/User").User, as: "assignee" },
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
        { model: require("../models/User").User, as: "assignee" },
        { model: Project, as: "project" },
        { model: require("../models/Comment").Comment, as: "comments" },
      ],
    });
  }

  // Get tasks assigned to a user
  async getTasksByAssignee(
    assigneeId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Task[]> {
    const offset = (page - 1) * limit;
    return await Task.findAll({
      where: { assigneeId },
      include: [{ model: Project, as: "project" }],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
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
        { model: require("../models/User").User, as: "assignee" },
        { model: Project, as: "project" },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  // Update task
  async updateTask(
    id: string,
    updateData: UpdateTaskRequest
  ): Promise<Task | null> {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    await Task.update(updateData, { where: { id } });
    return await this.getTaskById(id);
  }

  // Update task status
  async updateTaskStatus(id: string, status: string): Promise<Task | null> {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    await Task.update({ status } as any, { where: { id } });
    return await this.getTaskById(id);
  }

  // Assign task to user
  async assignTask(
    id: string,
    assigneeId: string | null
  ): Promise<Task | null> {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    await Task.update({ assigneeId } as any, { where: { id } });
    return await this.getTaskById(id);
  }

  // Delete task (soft delete)
  async deleteTask(id: string): Promise<boolean> {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    await Task.destroy({ where: { id } });
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
      [require("sequelize").Op.or]: [
        { title: { [require("sequelize").Op.like]: `%${searchTerm}%` } },
        { description: { [require("sequelize").Op.like]: `%${searchTerm}%` } },
      ],
    };

    if (projectId) {
      whereCondition.projectId = projectId;
    }

    return await Task.findAll({
      where: whereCondition,
      include: [
        { model: require("../models/User").User, as: "assignee" },
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
        { model: require("../models/User").User, as: "assignee" },
        { model: Project, as: "project" },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  // Get overdue tasks
  async getOverdueTasks(projectId?: number): Promise<Task[]> {
    const whereCondition: any = {
      dueDate: {
        [require("sequelize").Op.lt]: new Date(),
      },
      status: {
        [require("sequelize").Op.ne]: "done",
      },
    };

    if (projectId) {
      whereCondition.projectId = projectId;
    }

    return await Task.findAll({
      where: whereCondition,
      include: [
        { model: require("../models/User").User, as: "assignee" },
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
        [require("sequelize").Op.between]: [new Date(), sevenDaysFromNow],
      },
      status: {
        [require("sequelize").Op.ne]: "done",
      },
    };

    if (projectId) {
      whereCondition.projectId = projectId;
    }

    return await Task.findAll({
      where: whereCondition,
      include: [
        { model: require("../models/User").User, as: "assignee" },
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
}

export const taskService = new TaskService();
