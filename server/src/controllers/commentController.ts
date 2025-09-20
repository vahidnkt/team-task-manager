import { Request, Response } from "express";
import { commentService } from "../services/commentService";
import { AuthRequest } from "../types/auth.types";
import { ApiResponse } from "../types/api.types";
import {
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../types/comment.types";

export class CommentController {
  // Get all comments for a task
  async getCommentsByTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;

      if (!taskId) {
        res.status(400).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const comments = await commentService.getCommentsByTask(parseInt(taskId));

      const response: ApiResponse = {
        success: true,
        data: comments,
        message: "Comments retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve comments",
      });
    }
  }

  // Add comment to task
  async createComment(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const { taskId } = req.params;

      if (!taskId) {
        res.status(400).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const commentData: CreateCommentRequest = {
        ...req.body,
        task_id: parseInt(taskId),
        commenter_id: req.user.userId,
      };

      const newComment = await commentService.createComment(commentData);

      const response: ApiResponse = {
        success: true,
        data: newComment,
        message: "Comment created successfully",
      };
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create comment",
      });
    }
  }

  // Update comment
  async updateComment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateCommentRequest = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Comment ID is required",
        });
        return;
      }

      // Check if user is the comment author or admin
      const comment = await commentService.getCommentById(parseInt(id));
      if (!comment) {
        res.status(404).json({
          success: false,
          message: "Comment not found",
        });
        return;
      }

      if (
        req.user?.role !== "admin" &&
        req.user?.userId !== comment.commenter_id
      ) {
        res.status(403).json({
          success: false,
          message: "Not authorized to update this comment",
        });
        return;
      }

      const updatedComment = await commentService.updateComment(
        parseInt(id),
        updateData
      );

      const response: ApiResponse = {
        success: true,
        data: updatedComment,
        message: "Comment updated successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update comment",
      });
    }
  }

  // Delete comment
  async deleteComment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Comment ID is required",
        });
        return;
      }

      // Check if user is the comment author or admin
      const comment = await commentService.getCommentById(parseInt(id));
      if (!comment) {
        res.status(404).json({
          success: false,
          message: "Comment not found",
        });
        return;
      }

      if (
        req.user?.role !== "admin" &&
        req.user?.userId !== comment.commenter_id
      ) {
        res.status(403).json({
          success: false,
          message: "Not authorized to delete this comment",
        });
        return;
      }

      await commentService.deleteComment(parseInt(id));

      const response: ApiResponse = {
        success: true,
        message: "Comment deleted successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete comment",
      });
    }
  }

  // Get comment by ID
  async getCommentById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Comment ID is required",
        });
        return;
      }

      const comment = await commentService.getCommentById(parseInt(id));

      if (!comment) {
        res.status(404).json({
          success: false,
          message: "Comment not found",
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: comment,
        message: "Comment retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to retrieve comment",
      });
    }
  }

  // Get recent comments by user
  async getUserComments(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const comments = await commentService.getCommentsByUser(req.user.userId);

      const response: ApiResponse = {
        success: true,
        data: comments,
        message: "User comments retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve user comments",
      });
    }
  }
}

export const commentController = new CommentController();
