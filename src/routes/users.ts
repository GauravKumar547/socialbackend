import { Router } from 'express';
import {
    updateUser,
    deleteUser,
    getUser,
    getFriends,
    followUser,
    unfollowUser,
    updateProfilePicture,
    updateCoverPicture,
    searchUsers,
} from '../controllers/userController';
import { requireAuth } from '../middleware/sessionMiddleware';

const router = Router();

// Public routes
router.get('/', getUser);
router.get('/friends', getFriends);
router.get('/all', searchUsers);

// Protected routes
router.put('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, deleteUser);
router.put('/:id/follow', requireAuth, followUser);
router.put('/:id/unfollow', requireAuth, unfollowUser);
router.put('/:id/profile_pic', requireAuth, updateProfilePicture);
router.put('/:id/cover_pic', requireAuth, updateCoverPicture);

export default router; 