import {z} from 'zod';

export const createCommentSchema = z.object({
  ticketId: z.string().uuid('El ID del ticket debe ser un UUID válido'),
  content: z.string().min(1, 'El contenido del comentario no puede estar vacío').max(1000, 'El contenido del comentario no puede exceder los 1000 caracteres'),
});