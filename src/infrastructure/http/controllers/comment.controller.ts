import { Request, Response, NextFunction } from "express";
import { createCommentUseCase } from "@application/use-cases/comments/create-comment.use-case";
import { SequelizeTicketRepository } from "@infrastructure/database/repositories/sequelize-ticket.repository";
import { SequelizeCommentRepository } from "@infrastructure/database/repositories/sequelize.comment.repository";

const commentRepository = new SequelizeCommentRepository();
const ticketRepository = new SequelizeTicketRepository();

export class CommentController {

  static async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dataComment = req.body;
      const user = (req as any).user; // El usuario completo viene del middleware de autenticación

      const createComment = createCommentUseCase(
        commentRepository,
        ticketRepository
      );
      
      const comment = await createComment(user, dataComment);

      res.status(201).json({
        success: true,
        data: comment
      });
    } catch (error) {
      next(error);
    }
  }
}
