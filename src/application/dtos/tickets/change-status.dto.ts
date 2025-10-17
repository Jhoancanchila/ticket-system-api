import { TicketStatus } from '@domain/enums/TicketStatus';

export interface ChangeStatusDTO {
  status: TicketStatus;
  comment?: string;
}
