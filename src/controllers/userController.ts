import { Response } from 'express';
import { UserRequest, IUserResponse, FriendListResponse, UserSearchResponse, AuthenticatedRequest } from '../types';
import { asyncHandler, createError } from '../utils/errorHandler';
import { sendData, sendMessage } from '../utils/responseHandler';
import { UserService } from '../services/userService';

/**
 * Update user
 */
export const updateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { id } = req.params;
    const { password, ...updateData } = req.body;

    if (!id) {
        throw createError('User ID is required', 400);
    }

    await UserService.updateUser(
        id,
        { ...updateData, ...(password && { password }) },
        req.user._id,
        req.user.isAdmin
    );

    sendMessage(res, 'Account has been updated');
});

/**
 * Delete user
 */
export const deleteUser = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { id } = req.params;

    if (!id) {
        throw createError('User ID is required', 400);
    }

    await UserService.deleteUser(id, req.user._id, req.user.isAdmin);
    sendMessage(res, 'Account has been deleted successfully');
});

/**
 * Get a user
 */
export const getUser = asyncHandler(async (req: UserRequest, res: Response): Promise<void> => {
    const { user_id, username } = req.query;

    const user = await UserService.getUser(user_id as string, username as string);
    sendData<Omit<IUserResponse, 'password'>>(res, user);
});

/**
 * Get friends
 */
export const getFriends = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    if (!req.user?._id) {
        throw createError('User ID is required', 400);
    }
    let userParam: IUserResponse | string = req.user;
    if (req.query.user_id) {
        userParam = req.query.user_id as string;
    }
    const friends = await UserService.getUserFriends(userParam);
    sendData<FriendListResponse[]>(res, friends);
});

/**
 * Follow a user
 */
export const followUser = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { id } = req.params;

    if (!id) {
        throw createError('User ID is required', 400);
    }

    await UserService.followUser(id, req.user._id);
    sendMessage(res, 'user has been followed');
});

/**
 * Unfollow a user
 */
export const unfollowUser = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { id } = req.params;

    if (!id) {
        throw createError('User ID is required', 400);
    }

    await UserService.unfollowUser(id, req.user._id);
    sendMessage(res, 'user has been unfollowed');
});

/**
 * Update profile picture
 */
export const updateProfilePicture = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { id } = req.params;
    const { pic } = req.body;

    if (!id) {
        throw createError('User ID is required', 400);
    }

    if (!pic) {
        throw createError('Picture URL is required', 400);
    }

    await UserService.updateProfilePicture(id, pic, req.user._id);
    sendMessage(res, 'Profile picture updated');
});

/**
 * Update cover picture
 */
export const updateCoverPicture = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { id } = req.params;
    const { pic } = req.body;

    if (!id) {
        throw createError('User ID is required', 400);
    }

    if (!pic) {
        throw createError('Picture URL is required', 400);
    }

    await UserService.updateCoverPicture(id, pic, req.user._id);
    sendMessage(res, 'Cover picture updated');
});

/**
 * Search all users
 */
export const searchUsers = asyncHandler(async (req: UserRequest, res: Response): Promise<void> => {
    const { q } = req.query;

    if (!q) {
        throw createError('Name parameter is required', 400);
    }

    const response = await UserService.searchUsers(q as string);
    sendData<UserSearchResponse>(res, response);
});


/**
 * Get all users
 */
export const getAllUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    const response = await UserService.getAllUsers();
    sendData<UserSearchResponse>(res, response);
}); 