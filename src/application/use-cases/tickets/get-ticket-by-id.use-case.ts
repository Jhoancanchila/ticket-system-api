import { ITicketRepository } from '@application/ports/repositories/ticket.repository.interface';
import { Ticket } from '@domain/entities/Ticket';
import { User } from '@domain/entities/User';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { ForbiddenError } from '@domain/errors/ForbiddenError';

export const createGetTicketByIdUseCase = (ticketRepository: ITicketRepository) => {
  return async (ticketId: string, user: User): Promise<Ticket> => {
    const ticket = await ticketRepository.findById(ticketId);
    
    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    if (!user.canAccessTicket(ticket.clientId)) {
      throw new ForbiddenError('No tienes acceso a este ticket');
    }

    return ticket;
  };
};

export type GetTicketByIdUseCase = ReturnType<typeof createGetTicketByIdUseCase>;