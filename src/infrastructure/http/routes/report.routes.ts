import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ReportController } from '../controllers/report.Controller';


const router = Router();

router.use(authMiddleware)

router.get('/summary', ReportController.generateReport);

export default router;