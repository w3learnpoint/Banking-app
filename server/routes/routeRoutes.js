import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorize, autoRegisterPermission } from '../middleware/rbac.js';
import { getAllRoutes } from '../controllers/routeController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', autoRegisterPermission, authorize(), getAllRoutes);

export default router;
