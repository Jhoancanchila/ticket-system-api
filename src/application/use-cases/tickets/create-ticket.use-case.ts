import { ITicketRepository } from '@application/ports/repositories/ticket.repository.interface';
import { IEmailService } from '@application/ports/services/email.service.interface';
import { IUserRepository } from '@application/ports/repositories/user.repository.interface';
import { CreateTicketDTO } from '@application/dtos/tickets/create-ticket.dto';
import { Ticket } from '@domain/entities/Ticket';
import { TicketStatus } from '@domain/enums/TicketStatus';
import { NotFoundError } from '@domain/errors/NotFoundError';

/**
 * Caso de Uso: Crear Ticket
 * Implementado con programación funcional
 */
export const createTicketUseCase = (
  ticketRepository: ITicketRepository,
  userRepository: IUserRepository,
  emailService: IEmailService
) => {
  return async (clientId: string, data: CreateTicketDTO): Promise<Ticket> => {
    // 1. Verificar que el cliente existe
    const client = await userRepository.findById(clientId);
    
    if (!client) {
      throw new NotFoundError('Cliente');
    }

    // 2. Crear el ticket
    const ticketData: any = {
      title: data.title,
      description: data.description,
      status: TicketStatus.PENDING,
      clientId: clientId,
      resolvedAt: null
    };

    const ticket = await ticketRepository.create(ticketData);

    // 3. Enviar email de confirmación (sin bloquear el flujo)
    emailService
      .sendTicketCreatedEmail(client.email.getValue(), ticket.id, ticket.title)
      .catch(() => {
        // Log error silently - email failure shouldn't stop ticket creation
      });

    return ticket;
  };
};

export type CreateTicketUseCase = ReturnType<typeof createTicketUseCase>;
