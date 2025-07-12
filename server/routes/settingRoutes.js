import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getUserSetting, saveUserSetting } from '../controllers/settingController.js';
import { authorize, autoRegisterPermission } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', getUserSetting);
router.post('/', authenticateToken, authorize(), autoRegisterPermission, saveUserSetting);

export default router;
