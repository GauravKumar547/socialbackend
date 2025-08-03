import { Router } from 'express';
import {
    createConversation,
    getConversation,
    getConversationBetweenUsers,
} from '../controllers/conversationController';
import { requireAuth } from '../middleware/sessionMiddleware';

const router = Router();

// Protected routes
router.post('/', requireAuth, createConversation);
router.get('/:user_id', requireAuth, getConversation);
router.get('/:first_user_id/:second_user_id', requireAuth, getConversationBetweenUsers);

export default router; 