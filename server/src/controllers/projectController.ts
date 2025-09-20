import { Request, Response } from "express";
import { projectService } from "../services/projectService";
import { AuthRequest } from "../types/auth.types";
import { ApiResponse } from "../types/api.types";
import {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/project.types";
import { HTTP_STATUS } from "../utils/constants";

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
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
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
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      const project = await projectService.getProjectById(id);

      if (!project) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
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
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      // Check if user is admin or project creator
      const project = await projectService.getProjectById(id);
      if (!project) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Project not found",
        });
        return;
      }

      if (
        req.user?.role !== "admin" &&
        req.user?.userId !== project.createdBy
      ) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: "Not authorized to update this project",
        });
        return;
      }

      const updatedProject = await projectService.updateProject(id, updateData);

      const response: ApiResponse = {
        success: true,
        data: updatedProject,
        message: "Project updated successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Project ID is required",
        });
        return;
      }

      // Check if user is admin or project creator
      const project = await projectService.getProjectById(id);
      if (!project) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Project not found",
        });
        return;
      }

      if (
        req.user?.role !== "admin" &&
        req.user?.userId !== project.createdBy
      ) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: "Not authorized to delete this project",
        });
        return;
      }

      await projectService.deleteProject(id);

      const response: ApiResponse = {
        success: true,
        message: "Project deleted successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const projects = await projectService.getProjectsByCreator(
        req.user.userId
      );

      const response: ApiResponse = {
        success: true,
        data: projects,
        message: "User projects retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
