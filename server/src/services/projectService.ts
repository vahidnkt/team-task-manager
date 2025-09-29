import { Project } from "../models/Project";
import { Task } from "../models/Task";
import {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/project.types";
import { HTTP_STATUS } from "../utils/constants";
import { activityService } from "./activityService";
import { logger } from "../utils/logger";

export class ProjectService {
  // Create a new project
  async createProject(
    projectData: CreateProjectRequest,
    createdBy: string
  ): Promise<Project> {
    const { name, description } = projectData;

    // Check if project with same name already exists
    const existingProject = await Project.findOne({
      where: { name: name.trim() },
    });

    if (existingProject) {
      const error = new Error(
        `Project with name "${name.trim()}" already exists`
      ) as any;
      error.statusCode = HTTP_STATUS.CONFLICT;
      error.isOperational = true;
      throw error;
    }

    // Create project using Sequelize
    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || undefined,
      createdBy,
    } as any);

    // Log activity - project created
    try {
      await activityService.logProjectCreated(
        project.id,
        createdBy,
        project.name
      );
    } catch (activityError) {
      // Log activity error but don't fail the project creation
      logger.error(
        "Failed to log project creation activity",
        activityError as Error
      );
    }

    return project;
  }

  // Get all projects with search and filter
  async getAllProjects(
    options: {
      search?: string;
      status?: string;
      priority?: string;
      limit?: number;
      offset?: number;
      sortBy?: "name" | "status" | "priority" | "created_at" | "updated_at";
      sortOrder?: "ASC" | "DESC";
    } = {}
  ): Promise<{
    projects: Project[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const {
      search = "",
      status,
      priority,
      limit = 10,
      offset = 0,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = options;

    // Build search conditions
    const searchConditions: any = {};

    if (search) {
      searchConditions[require("sequelize").Op.or] = [
        { name: { [require("sequelize").Op.like]: `%${search}%` } },
        { description: { [require("sequelize").Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      searchConditions.status = status;
    }

    if (priority) {
      searchConditions.priority = priority;
    }

    // Get projects with search and filter
    const { count, rows: projects } = await Project.findAndCountAll({
      where: searchConditions,
      include: [
        { model: require("../models/User").User, as: "creator" },
        { model: Task, as: "tasks" },
      ],
      limit: Math.min(limit, 100), // Max 100 projects per request
      offset,
      order: [[sortBy, sortOrder]],
      paranoid: true, // Explicitly exclude soft-deleted records
    });

    return {
      projects,
      total: count,
      limit,
      offset,
    };
  }

  // Get project by ID
  async getProjectById(id: string): Promise<Project | null> {
    return await Project.findByPk(id, {
      include: [
        { model: require("../models/User").User, as: "creator" },
        { model: Task, as: "tasks" },
        { model: require("../models/Activity").Activity, as: "activities" },
      ],
    });
  }

  // Get projects by creator
  async getProjectsByCreator(
    createdBy: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Project[]> {
    const offset = (page - 1) * limit;
    return await Project.findAll({
      where: { createdBy },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
  }

  // Update project
  async updateProject(
    id: string,
    updateData: UpdateProjectRequest
  ): Promise<Project | null> {
    const project = await this.getProjectById(id);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check if name is being updated and if it conflicts with existing project
    if (updateData.name && updateData.name.trim() !== project.name) {
      const existingProject = await Project.findOne({
        where: { name: updateData.name.trim() },
      });

      if (existingProject && existingProject.id !== id) {
        const error = new Error(
          `Project with name "${updateData.name.trim()}" already exists`
        ) as any;
        error.statusCode = HTTP_STATUS.CONFLICT;
        error.isOperational = true;
        throw error;
      }
    }

    await Project.update(updateData, { where: { id } });
    return await this.getProjectById(id);
  }

  // Delete project (soft delete)
  async deleteProject(id: string): Promise<boolean> {
    const project = await this.getProjectById(id);
    if (!project) {
      throw new Error("Project not found");
    }

    await Project.destroy({ where: { id } });
    return true;
  }

  // Get project statistics
  async getProjectStats(projectId: string): Promise<any> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

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

  // Search projects by name or description
  async searchProjects(
    searchTerm: string,
    limit: number = 20
  ): Promise<Project[]> {
    return await Project.findAll({
      where: {
        [require("sequelize").Op.or]: [
          { name: { [require("sequelize").Op.like]: `%${searchTerm}%` } },
          {
            description: { [require("sequelize").Op.like]: `%${searchTerm}%` },
          },
        ],
      },
      order: [["createdAt", "DESC"]],
      limit,
    });
  }

  // Get recent projects
  async getRecentProjects(limit: number = 10): Promise<Project[]> {
    return await Project.findAll({
      order: [["createdAt", "DESC"]],
      limit,
    });
  }

  // Check if project exists
  async projectExists(id: string): Promise<boolean> {
    const project = await this.getProjectById(id);
    return !!project;
  }

  // Get project team members (users who have tasks in this project)
  async getProjectTeamMembers(projectId: number): Promise<any[]> {
    const { User } = require("../models/User");

    return await Task.findAll({
      attributes: [
        [
          require("sequelize").fn("COUNT", require("sequelize").col("Task.id")),
          "task_count",
        ],
      ],
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "username", "email"],
        },
      ],
      where: { projectId },
      group: ["assignee.id"],
      raw: true,
    });
  }

  // Check if user has tasks in project
  async userHasTasksInProject(
    userId: number,
    projectId: number
  ): Promise<boolean> {
    const count = await Task.count({
      where: { projectId, assigneeId: userId },
    });
    return count > 0;
  }

  // Complete a project
  async completeProject(
    projectId: string,
    userId: string,
    completionNotes?: string
  ): Promise<Project> {
    const project = await Project.findByPk(projectId);

    if (!project) {
      const error = new Error("Project not found") as any;
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      error.isOperational = true;
      throw error;
    }

    if (project.status === "completed") {
      const error = new Error("Project is already completed") as any;
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      error.isOperational = true;
      throw error;
    }

    // Update project status to completed
    await project.update({
      status: "completed",
      description: completionNotes
        ? `${
            project.description || ""
          }\n\nCompletion Notes: ${completionNotes}`.trim()
        : project.description,
    });

    // Log activity - project completed
    try {
      await activityService.createActivity({
        project_id: projectId,
        task_id: undefined,
        user_id: userId,
        action: "project_completed",
        description: `Project '${project.name}' was completed${
          completionNotes ? " with notes" : ""
        }`,
      });
    } catch (activityError) {
      // Log activity error but don't fail the project completion
      logger.error(
        "Failed to log project completion activity",
        activityError as Error
      );
    }

    return project;
  }
}

export const projectService = new ProjectService();
