import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session';
import { ISession } from '../types';

export class SessionService {
    /**
     * Create a new session for a user
     */
    static async createSession(
        user_id: string,
        user_agent?: string,
        ip_address?: string
    ): Promise<ISession> {
        const session_id = uuidv4();
        const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const session = new Session({
            user_id,
            session_id,
            expires_at,
            user_agent,
            ip_address,
            is_active: true,
        });

        return await session.save();
    }

    /**
     * Validate and get session by session_id
     */
    static async getSession(session_id: string): Promise<ISession | null> {
        const session = await Session.findOne({
            session_id,
            is_active: true,
            expires_at: { $gt: new Date() },
        });

        if (session) {
            // Update last accessed time
            await session.updateOne({ last_accessed: new Date() });
        }

        return session;
    }

    /**
     * Get all active sessions for a user
     */
    static async getUserSessions(user_id: string): Promise<ISession[]> {
        return await Session.find({
            user_id,
            is_active: true,
            expires_at: { $gt: new Date() },
        }).sort({ last_accessed: -1 });
    }

    /**
     * Delete a specific session
     */
    static async deleteSession(session_id: string): Promise<boolean> {
        const result = await Session.updateOne(
            { session_id },
            { is_active: false }
        );
        return result.modifiedCount > 0;
    }

    /**
     * Delete all sessions for a user
     */
    static async deleteAllUserSessions(user_id: string): Promise<number> {
        const result = await Session.updateMany(
            { user_id },
            { is_active: false }
        );
        return result.modifiedCount;
    }

    /**
     * Clean up expired sessions
     */
    static async cleanupExpiredSessions(): Promise<number> {
        const result = await Session.updateMany(
            { expires_at: { $lt: new Date() } },
            { is_active: false }
        );
        return result.modifiedCount;
    }

    /**
     * Extend session expiration
     */
    static async extendSession(session_id: string): Promise<boolean> {
        const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        const result = await Session.updateOne(
            { session_id, is_active: true },
            {
                expires_at: newExpiresAt,
                last_accessed: new Date()
            }
        );
        return result.modifiedCount > 0;
    }
} 