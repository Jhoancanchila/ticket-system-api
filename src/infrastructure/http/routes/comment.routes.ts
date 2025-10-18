import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { createCommentSchema } from '../validators/comment.validator';
import { CommentController } from '../controllers/comment.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.post('/', validateBody(createCommentSchema), CommentController.createComment);

export default router;