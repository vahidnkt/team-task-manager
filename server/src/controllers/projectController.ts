import { Request, Response } from "express";
import { projectService } from "../services/projectService";
import { AuthRequest } from "../types/auth.types";
import { ApiResponse } from "../types/api.types";
import {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/project.types";

export class ProjectController {
  // Get all projects
  async getAllProjects(req: AuthRequest, res: Response): Promise<void> {
    try {
      const projects = await projectService.getAllProjects();
      const response: ApiResponse = {
        success: true,
        data: projects,
        message: "Projects retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve projects",
      });
    }
  }

  // Create new project
  async createProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const projectData: CreateProjectRequest = {
        ...req.body,
      };

      const newProject = await projectService.createProject(
        projectData,
        req.user.userId
      );

      const response: ApiResponse = {
        success: true,
        data: newProject,
        message: "Project created successfully",
      };
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create project",
      });
    }
  }

  // Get specific project by ID
  async getProjectById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      const project = await projectService.getProjectById(parseInt(id));

      if (!project) {
        res.status(404).json({
          success: false,
          message: "Project not found",
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: project,
        message: "Project retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to retrieve project",
      });
    }
  }

  // Update project
  async updateProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateProjectRequest = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      // Check if user is admin or project creator
      const project = await projectService.getProjectById(parseInt(id));
      if (!project) {
        res.status(404).json({
          success: false,
          message: "Project not found",
        });
        return;
      }

      if (
        req.user?.role !== "admin" &&
        req.user?.userId !== project.created_by
      ) {
        res.status(403).json({
          success: false,
          message: "Not authorized to update this project",
        });
        return;
      }

      const updatedProject = await projectService.updateProject(
        parseInt(id),
        updateData
      );

      const response: ApiResponse = {
        success: true,
        data: updatedProject,
        message: "Project updated successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update project",
      });
    }
  }

  // Delete project
  async deleteProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      // Check if user is admin or project creator
      const project = await projectService.getProjectById(parseInt(id));
      if (!project) {
        res.status(404).json({
          success: false,
          message: "Project not found",
        });
        return;
      }

      if (
        req.user?.role !== "admin" &&
        req.user?.userId !== project.created_by
      ) {
        res.status(403).json({
          success: false,
          message: "Not authorized to delete this project",
        });
        return;
      }

      await projectService.deleteProject(parseInt(id));

      const response: ApiResponse = {
        success: true,
        message: "Project deleted successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete project",
      });
    }
  }

  // Get projects by user (projects created by or assigned to user)
  async getUserProjects(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const projects = await projectService.getProjectsByUser(req.user.userId);

      const response: ApiResponse = {
        success: true,
        data: projects,
        message: "User projects retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve user projects",
      });
    }
  }
}

export const projectController = new ProjectController();
