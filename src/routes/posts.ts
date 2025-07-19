import { Router } from 'express';
import {
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPost,
    getTimelinePosts,
    getUserPosts,
} from '../controllers/postController';
import { requireAuth } from '../middleware/sessionMiddleware';

const router = Router();

// Public routes
router.get('/:id', getPost);
router.get('/profile/:username', getUserPosts);

// Protected routes
router.post('/', requireAuth, createPost);
router.put('/:id', requireAuth, updatePost);
router.delete('/:id', requireAuth, deletePost);
router.put('/:id/like', requireAuth, likePost);
router.get('/timeline/:id', requireAuth, getTimelinePosts);

export default router; 