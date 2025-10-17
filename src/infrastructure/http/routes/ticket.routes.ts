import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { createTicketSchema, updateTicketSchema, changeStatusSchema } from '../validators/ticket.validator';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/', TicketController.getTickets);
router.get('/:id', TicketController.getTicketById);
router.post('/', validateBody(createTicketSchema), TicketController.createTicket);
router.put('/:id', validateBody(updateTicketSchema), TicketController.updateTicket);
router.patch('/:id/status', validateBody(changeStatusSchema), TicketController.changeTicketStatus);
router.delete('/:id', TicketController.deleteTicket);

export default router;