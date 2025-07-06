import express from 'express';
import {
    createPage,
    getAllPages,
    getPageBySlug,
    updatePage,
    deletePage
} from '../controllers/pageController.js';

import { authenticateToken } from '../middleware/auth.js';
import { authorize, autoRegisterPermission } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', autoRegisterPermission, authorize(), getAllPages);
router.get('/slug/:slug', autoRegisterPermission, authorize(), getPageBySlug);
router.post('/', autoRegisterPermission, authorize(), createPage);
router.put('/:pageId', autoRegisterPermission, authorize(), updatePage);
router.delete('/:pageId', autoRegisterPermission, authorize(), deletePage);

export default router;
