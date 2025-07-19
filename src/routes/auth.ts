import { Router } from 'express';
import {
    register,
    login,
    logout,
    getCurrentUser,
    getUserSessions,
    deleteSession,
    deleteAllSessions
} from '../controllers/authController';
import { requireAuth } from '../middleware/sessionMiddleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getCurrentUser);
router.get('/sessions', requireAuth, getUserSessions);
router.delete('/sessions/:session_id', requireAuth, deleteSession);
router.delete('/sessions', requireAuth, deleteAllSessions);

export default router; 