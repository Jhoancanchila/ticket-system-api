import { z } from 'zod';
import { TicketStatus } from '@domain/enums/TicketStatus';

export const createTicketSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(200),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
});

export const updateTicketSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).optional(),
});

export const changeStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus),
  comment: z.string().optional()
});