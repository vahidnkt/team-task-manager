import { Comment } from "../models/Comment";
import { Task } from "../models/Task";
import { User } from "../models/User";
import {
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../types/comment.types";
import { HTTP_STATUS } from "../utils/constants";

export class CommentService {
  // Create a new comment
  async createComment(commentData: CreateCommentRequest): Promise<Comment> {
    const { task_id, commenter_id, text } = commentData;

    // Verify task exists
    const task = await Task.findByPk(task_id);
    if (!task) {
      throw new Error("Task not found");
    }

    // Verify user exists
    const user = await User.findByPk(commenter_id);
    if (!user) {
      throw new Error("User not found");
    }

    // Create comment using Sequelize
    return await Comment.create({
      taskId: task_id,
      commenterId: commenter_id,
      text: text.trim(),
    } as any);
  }

  // Get comment by ID
  async getCommentById(id: string): Promise<Comment | null> {
    return await Comment.findByPk(id, {
      include: [
        { model: User, as: "commenter" },
        { model: Task, as: "task" },
      ],
    });
  }

  // Get all comments for a task
  async getCommentsByTask(taskId: string): Promise<Comment[]> {
    return await Comment.findAll({
      where: { taskId },
      include: [{ model: User, as: "commenter" }],
      order: [["createdAt", "ASC"]],
    });
  }

  // Get comments by user
  async getCommentsByUser(
    userId: string,
    limit?: number,
    offset?: number
  ): Promise<Comment[]> {
    const options: any = {
      where: { commenterId: userId },
      include: [
        { model: User, as: "commenter" },
        { model: Task, as: "task" },
      ],
      order: [["createdAt", "DESC"]],
    };

    if (limit !== undefined) {
      options.limit = limit;
      if (offset !== undefined) {
        options.offset = offset;
      }
    }

    return await Comment.findAll(options);
  }

  // Update comment
  async updateComment(
    id: string,
    updateData: UpdateCommentRequest
  ): Promise<Comment | null> {
    const comment = await this.getCommentById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    await Comment.update(updateData, { where: { id } });
    return await this.getCommentById(id);
  }

  // Delete comment
  async deleteComment(id: string): Promise<boolean> {
    const comment = await this.getCommentById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    await Comment.destroy({ where: { id } });
    return true;
  }

  // Get recent comments (admin function)
  async getRecentComments(
    limit: number = 50,
    offset: number = 0
  ): Promise<Comment[]> {
    return await Comment.findAll({
      include: [
        { model: User, as: "commenter" },
        {
          model: Task,
          as: "task",
          include: [
            { model: require("../models/Project").Project, as: "project" },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
  }

  // Get comment count for a task
  async getTaskCommentCount(taskId: string): Promise<number> {
    return await Comment.count({
      where: { taskId },
    });
  }

  // Get comment count by user
  async getUserCommentCount(userId: number): Promise<number> {
    return await Comment.count({
      where: { commenterId: userId },
    });
  }

  // Search comments by text
  async searchCommentsByText(
    searchTerm: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Comment[]> {
    return await Comment.findAll({
      where: {
        text: {
          [require("sequelize").Op.like]: `%${searchTerm}%`,
        },
      },
      include: [
        { model: User, as: "commenter" },
        { model: Task, as: "task" },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
  }

  // Check if user can modify comment
  async canUserModifyComment(
    commentId: string,
    userId: string,
    userRole: string
  ): Promise<boolean> {
    if (userRole === "admin") {
      return true;
    }

    const comment = await this.getCommentById(commentId);
    if (!comment) {
      return false;
    }

    return comment.commenterId === userId;
  }

  // Get comment with full details
  async getCommentWithDetails(id: string): Promise<any> {
    return await Comment.findByPk(id, {
      include: [
        { model: User, as: "commenter" },
        {
          model: Task,
          as: "task",
          include: [
            { model: require("../models/Project").Project, as: "project" },
          ],
        },
      ],
    });
  }
}

export const commentService = new CommentService();
