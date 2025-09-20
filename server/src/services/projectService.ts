import { Project } from "../models/Project";
import { Task } from "../models/Task";
import {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/project.types";

export class ProjectService {
  // Create a new project
  async createProject(
    projectData: CreateProjectRequest,
    createdBy: string
  ): Promise<Project> {
    const { name, description } = projectData;

    // Create project using Sequelize
    return await Project.create({
      name: name.trim(),
      description: description?.trim() || undefined,
      createdBy,
    } as any);
  }

  // Get all projects
  async getAllProjects(
    page: number = 1,
    limit: number = 10
  ): Promise<Project[]> {
    const offset = (page - 1) * limit;
    return await Project.findAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
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
}

export const projectService = new ProjectService();
