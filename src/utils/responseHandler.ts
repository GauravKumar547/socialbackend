import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
): void => {
    const response: ApiResponse<T> = {
        success: true,
        data,
        message,
    };
    res.status(statusCode).json(response);
};

export const sendError = (
    res: Response,
    error: string,
    statusCode: number = 500
): void => {
    const response: ApiResponse = {
        success: false,
        error,
    };
    res.status(statusCode).json(response);
};

export const sendMessage = (
    res: Response,
    message: string,
    statusCode: number = 200
): void => {
    res.status(statusCode).json(message);
};

export const sendData = <T>(
    res: Response,
    data: T,
    statusCode: number = 200
): void => {
    res.status(statusCode).json(data);
}; 