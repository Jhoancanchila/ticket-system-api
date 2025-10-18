import { createCommentDTO } from "@application/dtos/comments/create-comments.dto";
import { ICommentRepository } from "@application/ports/repositories/comment.repository.interface";
import { ITicketRepository } from "@application/ports/repositories/ticket.repository.interface";
import { Comment } from "@domain/entities/Comment";
import { User } from "@domain/entities/User";
import { ForbiddenError } from "@domain/errors/ForbiddenError";
import { NotFoundError } from "@domain/errors/NotFoundError";

export const createCommentUseCase = (
  commentRepository: ICommentRepository,
  ticketRepository: ITicketRepository
) => {
  return async (user: User, data: createCommentDTO ): Promise<Comment> => {

    if(!user.canManageAllTickets()){
      throw new ForbiddenError('No tienes permiso para agregar comentarios');
    }

    const ticket = await ticketRepository.findById(data.ticketId);
    if(!ticket){
      throw new NotFoundError('Ticket not found');
    }

    const commentData: any = {
      ticketId: data.ticketId,
      userId: user.id,
      content: data.content,
    };

    const comment = await commentRepository.create(commentData);
    return comment;
  }
}

export type CreateCommentUseCase = ReturnType<typeof createCommentUseCase>;