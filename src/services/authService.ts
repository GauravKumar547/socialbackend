import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import PasswordResetToken from '../models/PasswordResetToken';
import { SessionService } from './sessionService';
import { EmailService } from './emailService';
import { IUserResponse } from '../types';
import { createError } from '../utils/errorHandler';
import { transformUserToSafeResponse } from '../utils/transformers';

export class AuthService {
    /**
     * Register a new user
     */
    static async registerUser(
        username: string,
        email: string,
        password: string,
        userAgent?: string,
        ipAddress?: string
    ): Promise<{ user: Omit<IUserResponse, 'password'>; session: any }> {
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            throw createError('User already exists with this email or username', 400);
        }

        // Generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPass,
        });

        // Save user
        const user = await newUser.save();
        const userResponse = transformUserToSafeResponse(user);

        // Create session
        const session = await SessionService.createSession(
            (user as any)._id.toString(),
            userAgent,
            ipAddress
        );

        return { user: userResponse, session };
    }

    /**
     * Login user
     */
    static async loginUser(
        email: string,
        password: string,
        userAgent?: string,
        ipAddress?: string
    ): Promise<{ user: Omit<IUserResponse, 'password'>; session: any }> {
        const user = await User.findOne({ email });
        if (!user) {
            throw createError('User not found', 404);
        }

        // Compare password
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            throw createError('Wrong password', 400);
        }

        const userResponse = transformUserToSafeResponse(user);

        // Create session
        const session = await SessionService.createSession(
            (user as any)._id.toString(),
            userAgent,
            ipAddress
        );
        return { user: userResponse, session };
    }

    /**
     * Logout user
     */
    static async logoutUser(session_id: string): Promise<boolean> {
        if (session_id) {
            return await SessionService.deleteSession(session_id);
        }
        return false;
    }

    /**
     * Get current user
     */
    static async getCurrentUser(userId: string): Promise<Omit<IUserResponse, 'password'>> {
        const user = await User.findById(userId);
        if (!user) {
            throw createError('User not found', 404);
        }
        return transformUserToSafeResponse(user);
    }

    /**
     * Get user sessions
     */
    static async getUserSessions(userId: string): Promise<any[]> {
        const sessions = await SessionService.getUserSessions(userId);

        return sessions.map(session => ({
            session_id: session.session_id,
            created_at: session.created_at,
            last_accessed: session.last_accessed,
            expires_at: session.expires_at,
            user_agent: session.user_agent,
            ip_address: session.ip_address,
        }));
    }

    /**
     * Delete a specific session
     */
    static async deleteSession(session_id: string): Promise<boolean> {
        return await SessionService.deleteSession(session_id);
    }

    /**
     * Delete all user sessions
     */
    static async deleteAllUserSessions(userId: string): Promise<number> {
        return await SessionService.deleteAllUserSessions(userId);
    }

    /**
     * Request password reset
     */
    static async requestPasswordReset(email: string): Promise<void> {
        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists or not for security
            return;
        }

        // Generate reset token
        const resetToken = uuidv4();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save reset token
        const resetTokenDoc = new PasswordResetToken({
            email,
            token: resetToken,
            expiresAt,
        });

        await resetTokenDoc.save();

        // Send email
        await EmailService.sendPasswordResetEmail(email, resetToken, user.username);
    }

    /**
     * Reset password with token
     */
    static async resetPassword(token: string, newPassword: string): Promise<void> {
        const resetTokenDoc = await PasswordResetToken.findOne({
            token,
            used: false,
            expiresAt: { $gt: new Date() },
        });

        if (!resetTokenDoc) {
            throw createError('Invalid or expired reset token', 400);
        }

        // Find user by email
        const user = await User.findOne({ email: resetTokenDoc.email });
        if (!user) {
            throw createError('User not found', 404);
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        // Mark token as used
        resetTokenDoc.used = true;
        await resetTokenDoc.save();

        // Delete all user sessions to force re-login
        await SessionService.deleteAllUserSessions((user as any)._id.toString());
    }
} 