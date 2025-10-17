import { ITicketRepository } from '@application/ports/repositories/ticket.repository.interface';
import { Ticket } from '@domain/entities/Ticket';
import { User } from '@domain/entities/User';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { ForbiddenError } from '@domain/errors/ForbiddenError';

export interface UpdateTicketDTO {
  title?: string;
  description?: string;
}

export const createUpdateTicketUseCase = (ticketRepository: ITicketRepository) => {
  return async (ticketId: string, user: User, data: UpdateTicketDTO): Promise<Ticket> => {
    const ticket = await ticketRepository.findById(ticketId);
    
    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    if (!ticket.canBeEditedBy(user.id, user.role)) {
      throw new ForbiddenError('No tienes permiso para editar este ticket');
    }

    return await ticketRepository.update(ticketId, data);
  };
};

export type UpdateTicketUseCase = ReturnType<typeof createUpdateTicketUseCase>;