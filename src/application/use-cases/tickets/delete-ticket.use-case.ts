import { ITicketRepository } from '@application/ports/repositories/ticket.repository.interface';
import { User } from '@domain/entities/User';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { ForbiddenError } from '@domain/errors/ForbiddenError';

export const createDeleteTicketUseCase = (ticketRepository: ITicketRepository) => {
  return async (ticketId: string, user: User): Promise<void> => {
    if (!user.isAdmin()) {
      throw new ForbiddenError('Solo administradores pueden eliminar tickets');
    }

    const ticket = await ticketRepository.findById(ticketId);
    
    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    await ticketRepository.delete(ticketId);
  };
};

export type DeleteTicketUseCase = ReturnType<typeof createDeleteTicketUseCase>;