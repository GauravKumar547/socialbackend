import { Response } from 'express';
import { MessageRequest, IMessageResponse, AuthenticatedRequest } from '../types';
import { asyncHandler, createError } from '../utils/errorHandler';
import { sendData, sendMessage } from '../utils/responseHandler';
import { MessageService } from '../services/messageService';

/**
 * Create a new message
 */
export const createMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { conversation_id, text } = req.body;

    if (!conversation_id) {
        throw createError('Conversation ID is required', 400);
    }

    if (!text) {
        throw createError('Message text is required', 400);
    }

    const message = await MessageService.createMessage(
        conversation_id,
        req.user._id,
        text
    );

    sendData<IMessageResponse>(res, message);
});

/**
 * Get messages for a conversation
 */
export const getConversationMessages = asyncHandler(async (req: MessageRequest, res: Response): Promise<void> => {
    const { conversation_id } = req.params;

    if (!conversation_id) {
        throw createError('Conversation ID is required', 400);
    }

    const messages = await MessageService.getConversationMessages(conversation_id);
    sendData<IMessageResponse[]>(res, messages);
});

/**
 * Get a specific message
 */
export const getMessage = asyncHandler(async (req: MessageRequest, res: Response): Promise<void> => {
    const { conversation_id } = req.params;

    if (!conversation_id) {
        throw createError('Conversation ID is required', 400);
    }

    const messages = await MessageService.getConversationMessages(conversation_id);
    sendData<IMessageResponse[]>(res, messages);
});

/**
 * Delete a message
 */
export const deleteMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { message_id } = req.params;

    if (!message_id) {
        throw createError('Message ID is required', 400);
    }

    await MessageService.deleteMessage(message_id, req.user._id);
    sendMessage(res, 'Message deleted successfully');
});

/**
 * Update a message
 */
export const updateMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { message_id } = req.params;
    const { text } = req.body;

    if (!message_id) {
        throw createError('Message ID is required', 400);
    }

    if (!text) {
        throw createError('Message text is required', 400);
    }

    const message = await MessageService.updateMessage(message_id, req.user._id, text);
    sendData<IMessageResponse>(res, message);
}); 