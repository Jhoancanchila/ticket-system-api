import { Router } from 'express';
import authRoutes from './auth.routes';
import ticketRoutes from './ticket.routes';
import reportRoutes from './report.routes';
import commentRoutes from './comment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/reports', reportRoutes);
router.use('/comments', commentRoutes);

export default router;