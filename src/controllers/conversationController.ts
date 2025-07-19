import { Response } from 'express';
import { ConversationRequest, IConversationResponse, AuthenticatedRequest } from '../types';
import { asyncHandler, createError } from '../utils/errorHandler';
import { sendData } from '../utils/responseHandler';
import { ConversationService } from '../services/conversationService';

/**
 * Create a new conversation
 */
export const createConversation = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { receiverId } = req.body;

    if (!receiverId) {
        throw createError('Receiver ID is required', 400);
    }

    const conversation = await ConversationService.createConversation(
        req.user._id,
        receiverId
    );

    sendData<IConversationResponse>(res, conversation);
});

/**
 * Get conversations for a user
 */
export const getUserConversations = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const conversations = await ConversationService.getUserConversations(req.user._id);
    sendData<IConversationResponse[]>(res, conversations);
});

/**
 * Get a specific conversation
 */
export const getConversation = asyncHandler(async (req: ConversationRequest, res: Response): Promise<void> => {
    const { user_id } = req.params;

    if (!user_id) {
        throw createError('User ID is required', 400);
    }

    const conversations = await ConversationService.getUserConversations(user_id);
    sendData<IConversationResponse[]>(res, conversations);
});

/**
 * Get conversation between two users
 */
export const getConversationBetweenUsers = asyncHandler(async (req: ConversationRequest, res: Response): Promise<void> => {
    const { first_user_id, second_user_id } = req.params;

    if (!first_user_id || !second_user_id) {
        throw createError('Both user IDs are required', 400);
    }

    const conversation = await ConversationService.getConversationBetweenUsers(first_user_id, second_user_id);
    sendData<IConversationResponse | null>(res, conversation);
}); 