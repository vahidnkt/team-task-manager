import { CommentModel } from '../models/Comment';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../types/comment.types';

export class CommentService {
  // Create a new comment
  async createComment(commentData: CreateCommentRequest): Promise<Comment> {
    return await CommentModel.create(commentData);
  }

  // Get comment by ID
  async getCommentById(id: number): Promise<Comment | null> {
    return await CommentModel.findById(id);
  }

  // Get all comments for a task
  async getCommentsByTask(taskId: number): Promise<Comment[]> {
    return await CommentModel.findByTaskId(taskId);
  }

  // Get comments by user
  async getCommentsByUser(userId: number, limit?: number, offset?: number): Promise<Comment[]> {
    return await CommentModel.findByUserId(userId, limit, offset);
  }

  // Update comment
  async updateComment(id: number, updateData: UpdateCommentRequest): Promise<Comment | null> {
    return await CommentModel.update(id, updateData);
  }

  // Delete comment
  async deleteComment(id: number): Promise<boolean> {
    return await CommentModel.delete(id);
  }

  // Get recent comments (admin function)
  async getRecentComments(limit: number = 50, offset: number = 0): Promise<Comment[]> {
    return await CommentModel.findRecent(limit, offset);
  }

  // Get comment count for a task
  async getTaskCommentCount(taskId: number): Promise<number> {
    return await CommentModel.getTaskCommentCount(taskId);
  }

  // Get comment count by user
  async getUserCommentCount(userId: number): Promise<number> {
    return await CommentModel.getUserCommentCount(userId);
  }

  // Search comments by text
  async searchCommentsByText(searchTerm: string, limit: number = 50, offset: number = 0): Promise<Comment[]> {
    return await CommentModel.searchByText(searchTerm, limit, offset);
  }

  // Check if user can modify comment
  async canUserModifyComment(commentId: number, userId: number, userRole: string): Promise<boolean> {
    return await CommentModel.canUserModifyComment(commentId, userId, userRole);
  }
}

export const commentService = new CommentService();
