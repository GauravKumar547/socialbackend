import Message from '../models/Message';
import { IMessageResponse } from '../types';
import { createError } from '../utils/errorHandler';
import { transformMessageToResponse } from '../utils/transformers';

export class MessageService {
    /**
     * Create a new message
     */
    static async createMessage(
        conversationId: string,
        senderId: string,
        text: string
    ): Promise<IMessageResponse> {
        const newMessage = new Message({
            conversation_id: conversationId,
            sender_id: senderId,
            text,
        });

        const savedMessage = await newMessage.save();
        return transformMessageToResponse(savedMessage);
    }

    /**
     * Get messages for a conversation
     */
    static async getConversationMessages(conversationId: string): Promise<IMessageResponse[]> {
        const messages = await Message.find({ conversation_id: conversationId });
        return messages.map(message => transformMessageToResponse(message));
    }

    /**
     * Get a specific message
     */
    static async getMessage(messageId: string): Promise<IMessageResponse> {
        const message = await Message.findById(messageId);
        if (!message) {
            throw createError('Message not found', 404);
        }

        return transformMessageToResponse(message);
    }

    /**
     * Delete a message
     */
    static async deleteMessage(messageId: string, senderId: string): Promise<void> {
        const message = await Message.findById(messageId);
        if (!message) {
            throw createError('Message not found', 404);
        }

        if (message.sender_id.toString() !== senderId) {
            throw createError('You can only delete your own messages', 403);
        }

        await message.deleteOne();
    }

    /**
     * Update a message
     */
    static async updateMessage(
        messageId: string,
        senderId: string,
        text: string
    ): Promise<IMessageResponse> {
        const message = await Message.findById(messageId);
        if (!message) {
            throw createError('Message not found', 404);
        }

        if (message.sender_id.toString() !== senderId) {
            throw createError('You can only update your own messages', 403);
        }

        await message.updateOne({ $set: { text } });

        const updatedMessage = await Message.findById(messageId);
        return transformMessageToResponse(updatedMessage!);
    }
} 