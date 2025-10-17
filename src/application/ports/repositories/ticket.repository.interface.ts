import { Ticket } from '@domain/entities/Ticket';
import { TicketStatus } from '@domain/enums/TicketStatus';

export interface TicketFilters {
  status?: TicketStatus;
  clientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Puerto (Interface) para el repositorio de tickets
 */
export interface ITicketRepository {
  create(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket>;
  findById(id: string): Promise<Ticket | null>;
  findAll(filters?: TicketFilters, pagination?: PaginationOptions): Promise<PaginatedResult<Ticket>>;
  update(id: string, data: Partial<Omit<Ticket, 'id' | 'clientId' | 'createdAt'>>): Promise<Ticket>;
  delete(id: string): Promise<void>;
  countByStatus(): Promise<Record<TicketStatus, number>>;
  countByClient(clientId: string): Promise<number>;
}
