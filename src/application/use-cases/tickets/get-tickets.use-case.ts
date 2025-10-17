import { ITicketRepository, TicketFilters, PaginationOptions, PaginatedResult } from '@application/ports/repositories/ticket.repository.interface';
import { Ticket } from '@domain/entities/Ticket';
import { User } from '@domain/entities/User';

/**
 * Caso de Uso: Obtener Tickets
 * Implementado con programación funcional
 */
export const createGetTicketsUseCase = (ticketRepository: ITicketRepository) => {
  return async (
    user: User,
    filters?: TicketFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Ticket>> => {
    // Si es cliente, solo ver sus propios tickets
    const effectiveFilters = user.isClient()
      ? { ...filters, clientId: user.id }
      : filters;

    return await ticketRepository.findAll(effectiveFilters, pagination);
  };
};

export type GetTicketsUseCase = ReturnType<typeof createGetTicketsUseCase>;
