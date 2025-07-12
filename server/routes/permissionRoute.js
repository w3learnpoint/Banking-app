import express from 'express';
import { getPermissions, createPermission, getPermissionsByRole, getPermissionById, updatePermission } from '../controllers/permissionController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorize, autoRegisterPermission } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', autoRegisterPermission, authorize(), getPermissions);
router.get('/id/:id', autoRegisterPermission, authorize(), getPermissionById);
router.put('/:id', autoRegisterPermission, authorize(), updatePermission);
router.get('/:role', autoRegisterPermission, authorize(), getPermissionsByRole);
router.post('/', autoRegisterPermission, authorize(), createPermission);

export default router;