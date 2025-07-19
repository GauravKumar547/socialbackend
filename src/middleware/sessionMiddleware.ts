import { Response, NextFunction } from 'express';
import { SessionService } from '../services/sessionService';
import User from '../models/User';
import { AuthenticatedRequest } from '../types';
import { transformUserToSafeResponse } from '../utils/transformers';

/**
 * Session middleware - validates session and attaches user to request
 */
export const sessionMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const session_id = req.cookies?.session_id;

        if (!session_id) {
            return next();
        }

        // Get session from database
        const session = await SessionService.getSession(session_id);

        if (!session) {
            // Clear invalid cookie
            res.clearCookie('session_id');
            return next();
        }

        // Get user data
        const user = await User.findById(session.user_id);
        if (!user) {
            // User doesn't exist, clear session
            await SessionService.deleteSession(session_id);
            res.clearCookie('session_id');
            return next();
        }

        // Attach user to request
        req.user = transformUserToSafeResponse(user);

        // Extend session if it's close to expiring (within 1 day)
        const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        if (session.expires_at < oneDayFromNow) {
            await SessionService.extendSession(session_id);
        }

        next();
    } catch (error) {
        console.error('Session middleware error:', error);
        next();
    }
};

/**
 * Authentication required middleware
 */
export const requireAuth = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            error: 'Authentication required',
        });
        return;
    }
    next();
};

/**
 * Optional authentication middleware - doesn't fail if no user
 */
export const optionalAuth = (
    _req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): void => {
    // User is already attached by sessionMiddleware if available
    next();
}; 