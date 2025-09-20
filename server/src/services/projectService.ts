import { ProjectModel } from "../models/Project";
import { activityService } from "./activityService";
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/project.types";

export class ProjectService {
  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    return await ProjectModel.findAll();
  }

  // Get project by ID
  async getProjectById(id: number): Promise<Project | null> {
    return await ProjectModel.findById(id);
  }

  // Create new project
  async createProject(
    projectData: CreateProjectRequest,
    createdBy: number
  ): Promise<Project> {
    const { name, description } = projectData;

    // Validate required fields
    if (!name) {
      throw new Error("Project name is required");
    }

    // Create project
    const newProject = await ProjectModel.create(
      {
        name: name.trim(),
        description: description?.trim() || undefined,
      },
      createdBy
    );

    // Log activity
    await activityService.logProjectCreated(newProject.id, createdBy, name);

    return newProject;
  }

  // Update project
  async updateProject(
    id: number,
    updateData: UpdateProjectRequest
  ): Promise<Project | null> {
    const existingProject = await this.getProjectById(id);
    if (!existingProject) {
      throw new Error("Project not found");
    }

    // Prepare update data
    const cleanUpdateData: any = {};
    if (updateData.name !== undefined) {
      cleanUpdateData.name = updateData.name.trim();
    }
    if (updateData.description !== undefined) {
      cleanUpdateData.description = updateData.description?.trim() || null;
    }

    const updatedProject = await ProjectModel.update(id, cleanUpdateData);

    // Log activity if project was actually updated
    if (updatedProject) {
      await activityService.logProjectUpdated(
        id,
        updatedProject.created_by,
        updatedProject.name
      );
    }

    return updatedProject;
  }

  // Delete project (soft delete)
  async deleteProject(id: number): Promise<boolean> {
    const project = await this.getProjectById(id);
    if (!project) {
      throw new Error("Project not found");
    }

    const deleted = await ProjectModel.delete(id);

    // Log activity
    if (deleted) {
      await activityService.logProjectDeleted(
        id,
        project.created_by,
        project.name
      );
    }

    return deleted;
  }

  // Get projects by creator
  async getProjectsByCreator(creatorId: number): Promise<Project[]> {
    return await ProjectModel.findByCreator(creatorId);
  }

  // Get projects where user is involved (created by or has tasks assigned)
  async getProjectsByUser(userId: number): Promise<Project[]> {
    // This would require a more complex query joining with tasks
    // For now, return projects created by user
    return await this.getProjectsByCreator(userId);
  }

  // Search projects by name or description
  async searchProjects(
    searchTerm: string,
    limit: number = 20
  ): Promise<Project[]> {
    // TODO: Implement search functionality in ProjectModel
    return await ProjectModel.findAll(1, limit);
  }

  // Get recent projects
  async getRecentProjects(limit: number = 10): Promise<Project[]> {
    // TODO: Implement findRecent functionality in ProjectModel
    return await ProjectModel.findAll(1, limit);
  }

  // Get project statistics
  async getProjectStats(projectId: number): Promise<any> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Get task statistics for this project
    // TODO: Implement getProjectTaskStats in ProjectModel
    const taskStats = {
      total_tasks: 0,
      todo_tasks: 0,
      in_progress_tasks: 0,
      done_tasks: 0,
      low_priority_tasks: 0,
      medium_priority_tasks: 0,
      high_priority_tasks: 0,
    };

    return {
      project_id: projectId,
      project_name: project.name,
      created_by: project.created_by,
      created_at: project.created_at,
      total_tasks: taskStats.total_tasks,
      tasks_by_status: {
        todo: taskStats.todo_tasks,
        "in-progress": taskStats.in_progress_tasks,
        done: taskStats.done_tasks,
      },
      tasks_by_priority: {
        low: taskStats.low_priority_tasks,
        medium: taskStats.medium_priority_tasks,
        high: taskStats.high_priority_tasks,
      },
      completion_percentage:
        taskStats.total_tasks > 0
          ? Math.round((taskStats.done_tasks / taskStats.total_tasks) * 100)
          : 0,
    };
  }

  // Get project team members (users who have tasks in this project)
  async getProjectTeamMembers(projectId: number): Promise<any[]> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // TODO: Implement getProjectTeamMembers in ProjectModel
    return [];
  }

  // Check if user can access project
  async canUserAccessProject(
    projectId: number,
    userId: number,
    userRole: string
  ): Promise<boolean> {
    // Admin can access all projects
    if (userRole === "admin") {
      return true;
    }

    const project = await this.getProjectById(projectId);
    if (!project) {
      return false;
    }

    // Project creator can access
    if (project.created_by === userId) {
      return true;
    }

    // Check if user has tasks in this project
    // TODO: Implement userHasTasksInProject in ProjectModel
    return false;
  }

  // Check if user can modify project
  async canUserModifyProject(
    projectId: number,
    userId: number,
    userRole: string
  ): Promise<boolean> {
    // Admin can modify all projects
    if (userRole === "admin") {
      return true;
    }

    const project = await this.getProjectById(projectId);
    if (!project) {
      return false;
    }

    // Only project creator can modify (besides admin)
    return project.created_by === userId;
  }

  // Get project activity summary
  async getProjectActivitySummary(
    projectId: number,
    days: number = 30
  ): Promise<any> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    return await activityService.getProjectActivityStats(projectId, days);
  }

  // Archive project (different from delete)
  async archiveProject(projectId: number, userId: number): Promise<boolean> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // This would require adding an 'archived' field to the project model
    // For now, we'll log the activity
    await activityService.logProjectArchived(projectId, userId, project.name);

    return true;
  }

  // Duplicate project
  async duplicateProject(
    projectId: number,
    newName: string,
    userId: number
  ): Promise<Project> {
    const originalProject = await this.getProjectById(projectId);
    if (!originalProject) {
      throw new Error("Original project not found");
    }

    const duplicateData: CreateProjectRequest = {
      name: newName,
      description: originalProject.description
        ? `Copy of ${originalProject.name}: ${originalProject.description}`
        : `Copy of ${originalProject.name}`,
    };

    const newProject = await this.createProject(duplicateData, userId);

    // Log activity
    await activityService.logProjectDuplicated(
      newProject.id,
      userId,
      newName,
      originalProject.name
    );

    return newProject;
  }

  // Get project overview (basic stats + recent activities)
  async getProjectOverview(projectId: number): Promise<any> {
    const [stats, recentActivities] = await Promise.all([
      this.getProjectStats(projectId),
      activityService.getProjectActivities(projectId, 5), // Get 5 most recent activities
    ]);

    return {
      ...stats,
      recent_activities: recentActivities,
    };
  }

  // Validate project data
  private validateProjectData(
    data: CreateProjectRequest | UpdateProjectRequest
  ): void {
    if (
      "name" in data &&
      data.name &&
      (!data.name || data.name.trim().length === 0)
    ) {
      throw new Error("Project name is required");
    }

    if ("name" in data && data.name && data.name.trim().length > 255) {
      throw new Error("Project name must be less than 255 characters");
    }

    if (
      "description" in data &&
      data.description &&
      data.description.length > 1000
    ) {
      throw new Error("Project description must be less than 1000 characters");
    }
  }
}

export const projectService = new ProjectService();
