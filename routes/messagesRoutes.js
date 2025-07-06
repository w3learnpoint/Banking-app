import express from 'express';
import {
    deleteMessage,
    getMessages,
    replyToMessage,
    toggleReadStatus
} from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getMessages);
router.patch('/:id/read', toggleReadStatus);
router.post('/:id/reply', replyToMessage);
router.delete('/:id', deleteMessage);

export default router;