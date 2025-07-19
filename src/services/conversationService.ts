import Conversation from '../models/Conversation';
import { IConversationResponse } from '../types';
import { createError } from '../utils/errorHandler';
import { transformConversationToResponse } from '../utils/transformers';

export class ConversationService {
    /**
     * Create a new conversation
     */
    static async createConversation(
        senderId: string,
        receiverId: string
    ): Promise<IConversationResponse> {
        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] },
        });

        if (existingConversation) {
            return transformConversationToResponse(existingConversation);
        }

        const newConversation = new Conversation({
            members: [senderId, receiverId],
        });

        const savedConversation = await newConversation.save();
        return transformConversationToResponse(savedConversation);
    }

    /**
     * Get conversations for a user
     */
    static async getUserConversations(userId: string): Promise<IConversationResponse[]> {
        const conversations = await Conversation.find({
            members: { $in: [userId] },
        });

        return conversations.map(conversation => transformConversationToResponse(conversation));
    }

    /**
     * Get a specific conversation
     */
    static async getConversation(conversationId: string): Promise<IConversationResponse> {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            throw createError('Conversation not found', 404);
        }

        return transformConversationToResponse(conversation);
    }

    /**
     * Get conversation between two users
     */
    static async getConversationBetweenUsers(
        userId1: string,
        userId2: string
    ): Promise<IConversationResponse | null> {
        const conversation = await Conversation.findOne({
            members: { $all: [userId1, userId2] },
        });

        if (!conversation) {
            return null;
        }

        return transformConversationToResponse(conversation);
    }
} 