import Post from '../models/Post';
import User from '../models/User';
import { IPostResponse } from '../types';
import { createError } from '../utils/errorHandler';
import { transformPostToResponse } from '../utils/transformers';

export class PostService {
    /**
     * Create a post
     */
    static async createPost(
        userId: string,
        description: string,
        image: string = ''
    ): Promise<IPostResponse> {
        const newPost = new Post({
            user_id: userId,
            description,
            image,
        });

        const savedPost = await newPost.save();
        return transformPostToResponse(savedPost);
    }

    /**
     * Update a post
     */
    static async updatePost(
        postId: string,
        userId: string,
        description: string,
        image: string
    ): Promise<void> {
        const post = await Post.findById(postId);
        if (!post) {
            throw createError('Post not found', 404);
        }

        if (post.user_id.toString() !== userId) {
            throw createError('you can update only your post', 403);
        }

        await post.updateOne({ $set: { description, image } });
    }

    /**
     * Delete a post
     */
    static async deletePost(postId: string, userId: string): Promise<void> {
        const post = await Post.findById(postId);
        if (!post) {
            throw createError('Post not found', 404);
        }

        if (post.user_id.toString() !== userId) {
            throw createError('you can delete only your post', 403);
        }

        await post.deleteOne();
    }

    /**
     * Like/dislike a post
     */
    static async likePost(postId: string, userId: string): Promise<boolean> {
        const post = await Post.findById(postId);
        if (!post) {
            throw createError('Post not found', 404);
        }

        const isLiked = post.likes.includes(userId as any);

        if (isLiked) {
            await post.updateOne({ $pull: { likes: userId } });
            return false; // Post was unliked
        } else {
            await post.updateOne({ $push: { likes: userId } });
            return true; // Post was liked
        }
    }

    /**
     * Get a post by ID
     */
    static async getPost(postId: string): Promise<IPostResponse> {
        const post = await Post.findById(postId);
        if (!post) {
            throw createError('Post not found', 404);
        }

        return transformPostToResponse(post);
    }

    /**
     * Get timeline posts for a user
     */
    static async getTimelinePosts(userId: string): Promise<IPostResponse[]> {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            throw createError('User not found', 404);
        }

        const userPosts = await Post.find({ user_id: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.following.map(friendId => Post.find({ user_id: friendId }))
        );

        const allPosts = userPosts.concat(...friendPosts);
        return allPosts.map(post => transformPostToResponse(post));
    }

    /**
     * Get all posts by a specific user
     */
    static async getUserPosts(username: string): Promise<IPostResponse[]> {
        const currentUser = await User.findOne({ username });
        if (!currentUser) {
            throw createError('User not found', 404);
        }

        const userPosts = await Post.find({ user_id: currentUser._id });
        return userPosts.map(post => transformPostToResponse(post));
    }
} 