import { Response } from 'express';
import { AppError } from '../types';

export class CustomError extends Error implements AppError {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const createError = (message: string, statusCode: number = 500): CustomError => {
    return new CustomError(message, statusCode);
};

export const handleError = (error: Error, res: Response): void => {
    if (error instanceof CustomError) {
        res.status(error.statusCode).json({
            success: false,
            error: error.message,
        });
    } else {
        console.error('Unhandled error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

export const asyncHandler = <T extends any[], R>(
    fn: (...args: T) => Promise<R>
) => {
    return (...args: T): Promise<R> => {
        return Promise.resolve(fn(...args)).catch((error: Error) => {
            throw error;
        });
    };
}; 