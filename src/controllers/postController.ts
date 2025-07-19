import { Response } from 'express';
import { PostRequest, IPostResponse, AuthenticatedRequest } from '../types';
import { asyncHandler, createError } from '../utils/errorHandler';
import { sendData, sendMessage } from '../utils/responseHandler';
import { PostService } from '../services/postService';

/**
 * Create a post
 */
export const createPost = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { description, image } = req.body;

    if (!description) {
        throw createError('Description is required', 400);
    }

    const post = await PostService.createPost(
        req.user._id,
        description,
        image || ''
    );

    sendData<IPostResponse>(res, post);
});

/**
 * Update a post
 */
export const updatePost = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { id } = req.params;
    const { description, image } = req.body;

    if (!id) {
        throw createError('Post ID is required', 400);
    }

    if (!description) {
        throw createError('Description is required', 400);
    }

    await PostService.updatePost(id, req.user._id, description, image || '');
    sendMessage(res, 'post have been updated');
});

/**
 * Delete a post
 */
export const deletePost = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { id } = req.params;

    if (!id) {
        throw createError('Post ID is required', 400);
    }

    await PostService.deletePost(id, req.user._id);
    sendMessage(res, 'post have been deleted');
});

/**
 * Like/dislike a post
 */
export const likePost = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { id } = req.params;

    if (!id) {
        throw createError('Post ID is required', 400);
    }

    const wasLiked = await PostService.likePost(id, req.user._id);
    sendMessage(res, wasLiked ? 'post has been liked' : 'post has been disliked');
});

/**
 * Get a post
 */
export const getPost = asyncHandler(async (req: PostRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        throw createError('Post ID is required', 400);
    }

    const post = await PostService.getPost(id);
    sendData<IPostResponse>(res, post);
});

/**
 * Get timeline posts
 */
export const getTimelinePosts = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { id } = req.params;

    if (!id) {
        throw createError('User ID is required', 400);
    }

    const posts = await PostService.getTimelinePosts(id);
    sendData<IPostResponse[]>(res, posts);
});

/**
 * Get all user's posts
 */
export const getUserPosts = asyncHandler(async (req: PostRequest, res: Response): Promise<void> => {
    const { username } = req.params;

    if (!username) {
        throw createError('Username is required', 400);
    }

    const posts = await PostService.getUserPosts(username);
    sendData<IPostResponse[]>(res, posts);
}); 