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


// Protected routes
router.post('/', requireAuth, createPost);
router.get('/timeline', requireAuth, getTimelinePosts);
router.put('/:id', requireAuth, updatePost);
router.delete('/:id', requireAuth, deletePost);
router.put('/:id/like', requireAuth, likePost);

// Public routes
router.get('/:id', getPost);
router.get('/profile/:username', getUserPosts);

export default router; 