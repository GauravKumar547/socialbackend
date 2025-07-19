import { Router } from 'express';
import {
    createMessage,
    getConversationMessages,
    getMessage,
    deleteMessage,
    updateMessage,
} from '../controllers/messageController';
import { requireAuth } from '../middleware/sessionMiddleware';

const router = Router();

// Public routes
router.get('/:conversation_id', getConversationMessages);

// Protected routes
router.post('/', requireAuth, createMessage);
router.get('/message/:message_id', requireAuth, getMessage);
router.delete('/:message_id', requireAuth, deleteMessage);
router.put('/:message_id', requireAuth, updateMessage);

export default router; 