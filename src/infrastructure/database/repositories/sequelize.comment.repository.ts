import { ICommentRepository } from "@application/ports/repositories/comment.repository.interface";
import { Comment } from "@domain/entities/Comment";
import { CommentModel } from "../sequelize/models";

export class SequelizeCommentRepository implements ICommentRepository{
  async create(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment> {
    const commentModel = await CommentModel.create(comment as any);

    return Comment.create({
      id: commentModel.id,
      ticketId: commentModel.ticketId,
      userId: commentModel.userId,
      content: commentModel.content,
      createdAt: commentModel.createdAt
    });
  }
  
}