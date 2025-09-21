import { Request, Response } from "express";
import { commentService } from "../services/commentService";
import { AuthRequest } from "../types/auth.types";
import { ApiResponse } from "../types/api.types";
import {
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../types/comment.types";
import { HTTP_STATUS } from "../utils/constants";

export class CommentController {
  // Get all comments for a task with search and pagination
  async getCommentsByTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const { search, limit, offset, sortBy, sortOrder } = req.query as any;

      if (!taskId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const result = await commentService.getCommentsByTask(taskId, {
        search,
        limit,
        offset,
        sortBy,
        sortOrder,
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: "Comments retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const { taskId } = req.params;

      if (!taskId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const commentData: CreateCommentRequest = {
        ...req.body,
        task_id: taskId,
        commenter_id: req.user.userId,
      };

      const newComment = await commentService.createComment(commentData);

      const response: ApiResponse = {
        success: true,
        data: newComment,
        message: "Comment created successfully",
      };
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Comment ID is required",
        });
        return;
      }

      // Check if user is the comment author or admin
      const comment = await commentService.getCommentById(id);
      if (!comment) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Comment not found",
        });
        return;
      }

      if (
        req.user?.role !== "admin" &&
        req.user?.userId !== comment.commenterId
      ) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: "Not authorized to update this comment",
        });
        return;
      }

      const updatedComment = await commentService.updateComment(id, updateData);

      const response: ApiResponse = {
        success: true,
        data: updatedComment,
        message: "Comment updated successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Comment ID is required",
        });
        return;
      }

      // Check if user is the comment author or admin
      const comment = await commentService.getCommentById(id);
      if (!comment) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Comment not found",
        });
        return;
      }

      if (
        req.user?.role !== "admin" &&
        req.user?.userId !== comment.commenterId
      ) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: "Not authorized to delete this comment",
        });
        return;
      }

      await commentService.deleteComment(id);

      const response: ApiResponse = {
        success: true,
        message: "Comment deleted successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Comment ID is required",
        });
        return;
      }

      const comment = await commentService.getCommentById(id);

      if (!comment) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
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
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to retrieve comment",
      });
    }
  }

  // Get recent comments by user with search and pagination
  async getUserComments(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const { search, limit, offset, sortBy, sortOrder } = req.query as any;

      const result = await commentService.getCommentsByUser(req.user.userId, {
        search,
        limit,
        offset,
        sortBy,
        sortOrder,
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: "User comments retrieved successfully",
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
