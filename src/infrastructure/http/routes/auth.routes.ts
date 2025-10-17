import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validation.middleware';
import { loginSchema, refreshTokenSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/refresh', validateBody(refreshTokenSchema), AuthController.refreshToken);

export default router;