import { Response } from 'express';
import { AuthRequest, IUserResponse, AuthenticatedRequest } from '../types';
import { asyncHandler, createError } from '../utils/errorHandler';
import { sendData } from '../utils/responseHandler';
import { AuthService } from '../services/authService';

/**
 * Register a new user
 */
export const register = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw createError('Username, email, and password are required', 400);
    }

    const userAgent = req.get('User-Agent') || '';
    const ipAddress = req.ip || req.connection.remoteAddress || '';

    const { user, session } = await AuthService.registerUser(
        username,
        email,
        password,
        userAgent,
        ipAddress
    );

    // Set session cookie
    res.cookie('session_id', session.session_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendData<Omit<IUserResponse, 'password'>>(res, user);
});

/**
 * Login user
 */
export const login = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw createError('Email and password are required', 400);
    }

    const userAgent = req.get('User-Agent') || '';
    const ipAddress = req.ip || req.connection.remoteAddress || '';

    const { user, session } = await AuthService.loginUser(
        email,
        password,
        userAgent,
        ipAddress
    );

    // Set session cookie
    res.cookie('session_id', session.session_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendData<Omit<IUserResponse, 'password'>>(res, user);
});

/**
 * Logout user
 */
export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const session_id = req.cookies?.session_id;

    if (session_id) {
        await AuthService.logoutUser(session_id);
    }

    // Clear session cookie
    res.clearCookie('session_id');

    sendData(res, { message: 'Logged out successfully' });
});

/**
 * Get current user
 */
export const getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const user = await AuthService.getCurrentUser(req.user._id);
    sendData<Omit<IUserResponse, 'password'>>(res, user);
});

/**
 * Get user sessions
 */
export const getUserSessions = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const sessions = await AuthService.getUserSessions(req.user._id);
    sendData(res, sessions);
});

/**
 * Delete a specific session
 */
export const deleteSession = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const { session_id } = req.params;
    if (!session_id) {
        throw createError('Session ID is required', 400);
    }

    const success = await AuthService.deleteSession(session_id);

    if (!success) {
        throw createError('Session not found', 404);
    }

    sendData(res, { message: 'Session deleted successfully' });
});

/**
 * Delete all user sessions
 */
export const deleteAllSessions = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        throw createError('Not authenticated', 401);
    }

    const deletedCount = await AuthService.deleteAllUserSessions(req.user._id);
    sendData(res, { message: `${deletedCount} sessions deleted successfully` });
}); 