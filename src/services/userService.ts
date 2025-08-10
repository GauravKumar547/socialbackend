import bcrypt from 'bcrypt';
import User from '../models/User';
import { IUserResponse, FriendListResponse, UserSearchResponse } from '../types';
import { createError } from '../utils/errorHandler';
import { transformUserToSafeResponse } from '../utils/transformers';

export class UserService {
    /**
     * Update user
     */
    static async updateUser(
        userId: string,
        updateData: any,
        currentUserId: string,
        isAdmin: boolean = false
    ): Promise<void> {
        // Users can only update their own profile unless they're admin
        if (currentUserId !== userId && !isAdmin) {
            throw createError('You can update only your account!', 403);
        }

        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        await User.findByIdAndUpdate(userId, { $set: updateData });
    }

    /**
     * Delete user
     */
    static async deleteUser(
        userId: string,
        currentUserId: string,
        isAdmin: boolean = false
    ): Promise<void> {
        // Users can only delete their own account unless they're admin
        if (currentUserId !== userId && !isAdmin) {
            throw createError('You can delete only your account!', 403);
        }

        await User.findByIdAndDelete(userId);
    }

    /**
     * Get a user by ID or username
     */
    static async getUser(userId?: string, username?: string): Promise<Omit<IUserResponse, 'password'>> {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username });

        if (!user) {
            throw createError('User not found', 404);
        }

        return transformUserToSafeResponse(user);
    }

    /**
     * Get user's friends
     */
    static async getUserFriends(user: IUserResponse | string): Promise<FriendListResponse[]> {
        if (typeof user === 'string') {
            user = await UserService.getUser(user);
        }
        if (!user) {
            throw createError('User not found', 404);
        }

        const friends = await Promise.all(
            user.following.map(friendId => User.findById(friendId))
        );

        return friends
            .filter(friend => friend !== null)
            .map(friend => ({
                _id: (friend as any)._id.toString(),
                username: (friend as any).username,
                profilePicture: (friend as any).profilePicture,
            }));
    }

    /**
     * Follow a user
     */
    static async followUser(
        targetUserId: string,
        currentUserId: string
    ): Promise<void> {
        if (currentUserId === targetUserId) {
            throw createError('You cannot follow yourself', 403);
        }

        const user = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!user || !currentUser) {
            throw createError('User not found', 404);
        }

        if (!user.followers.includes(currentUser._id as any)) {
            await user.updateOne({ $push: { followers: currentUserId } });
            await currentUser.updateOne({ $push: { following: targetUserId } });
        } else {
            throw createError('you already following this user', 403);
        }
    }

    /**
     * Unfollow a user
     */
    static async unfollowUser(
        targetUserId: string,
        currentUserId: string
    ): Promise<void> {
        if (currentUserId === targetUserId) {
            throw createError('You cannot unfollow yourself', 403);
        }

        const user = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!user || !currentUser) {
            throw createError('User not found', 404);
        }

        if (user.followers.includes(currentUser._id as any)) {
            await user.updateOne({ $pull: { followers: currentUserId } });
            await currentUser.updateOne({ $pull: { following: targetUserId } });
        } else {
            throw createError('you already not following this user', 403);
        }
    }

    /**
     * Update profile picture
     */
    static async updateProfilePicture(
        userId: string,
        pic: string,
        currentUserId: string
    ): Promise<void> {
        // Users can only update their own profile picture
        if (currentUserId !== userId) {
            throw createError('You can only update your own profile picture', 403);
        }

        const user = await User.findById(userId);
        if (!user) {
            throw createError('User not found', 404);
        }

        await user.updateOne({ $set: { profilePicture: pic } });
    }

    /**
     * Update cover picture
     */
    static async updateCoverPicture(
        userId: string,
        pic: string,
        currentUserId: string
    ): Promise<void> {
        // Users can only update their own cover picture
        if (currentUserId !== userId) {
            throw createError('You can only update your own cover picture', 403);
        }

        const user = await User.findById(userId);
        if (!user) {
            throw createError('User not found', 404);
        }

        await user.updateOne({ $set: { coverPicture: pic } });
    }

    /**
     * Search users
     */
    static async searchUsers(query: string): Promise<UserSearchResponse> {
        if (!query) {
            throw createError('Name parameter is required', 400);
        }

        const regex = new RegExp(query, 'i');
        const users = await User.find({
            $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }],
        });

        const usersData = users.map(user => ({
            username: user.username,
            profilePicture: user.profilePicture,
            email: user.email,
            _id: (user as any)._id.toString(),
        }));

        return { users: usersData };
    }
    /**
     * Get all users
     */
    static async getAllUsers(user_id: string): Promise<UserSearchResponse> {
        const users = await User.find({
            _id: { $ne: user_id }
        });

        const usersData = users.map(user => ({
            username: user.username,
            profilePicture: user.profilePicture,
            email: user.email,
            _id: (user as any)._id.toString(),
        }));

        return { users: usersData };
    }
} 