import { ITicketRepository } from '@application/ports/repositories/ticket.repository.interface';
import { IUserRepository } from '@application/ports/repositories/user.repository.interface';
import { IEmailService } from '@application/ports/services/email.service.interface';
import { ChangeStatusDTO } from '@application/dtos/tickets/change-status.dto';
import { Ticket } from '@domain/entities/Ticket';
import { User } from '@domain/entities/User';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { ForbiddenError } from '@domain/errors/ForbiddenError';

/**
 * Caso de Uso: Cambiar Estado de Ticket
 * Implementado con programación funcional
 */
export const createChangeTicketStatusUseCase = (
  ticketRepository: ITicketRepository,
  userRepository: IUserRepository,
  emailService: IEmailService
) => {
  return async (ticketId: string, user: User, data: ChangeStatusDTO): Promise<Ticket> => {
    // 1. Solo admin y soporte pueden cambiar estado
    if (!user.canManageAllTickets()) {
      throw new ForbiddenError('No tienes permiso para cambiar el estado');
    }

    // 2. Buscar ticket
    const ticket = await ticketRepository.findById(ticketId);
    
    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    // 3. Cambiar estado
    ticket.changeStatus(data.status);
    
    const updatedTicket = await ticketRepository.update(ticketId, {
      status: ticket.status,
      resolvedAt: ticket.resolvedAt,
      updatedAt: ticket.updatedAt
    });

    // 4. Enviar email al cliente (sin bloquear)
    userRepository
      .findById(ticket.clientId)
      .then((client) => {
        if (client) {
          return emailService.sendTicketStatusChangedEmail(
            client.email.getValue(),
            ticket.id,
            data.status
          );
        }
        return Promise.resolve();
      })
      .catch(() => {
        // Log error silently
      });

    return updatedTicket;
  };
};

export type ChangeTicketStatusUseCase = ReturnType<typeof createChangeTicketStatusUseCase>;
