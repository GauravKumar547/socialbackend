import { Request } from 'express';
import { Document, Types } from 'mongoose';

// Base interfaces
export interface BaseDocument extends Document {
    createdAt: Date;
    updatedAt: Date;
}

// User types
export interface IUser extends BaseDocument {
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    coverPicture: string;
    followers: Types.ObjectId[];
    following: Types.ObjectId[];
    isAdmin: boolean;
    description?: string;
    city?: string;
    from?: string;
    relationship?: 1 | 2 | 3;
}

export interface IUserResponse {
    _id: string;
    username: string;
    email: string;
    profilePicture: string;
    coverPicture: string;
    followers: string[];
    following: string[];
    isAdmin: boolean;
    description?: string;
    city?: string;
    from?: string;
    relationship?: 1 | 2 | 3;
    createdAt: string;
    updatedAt: string;
}

// Post types
export interface IPost extends BaseDocument {
    user_id: Types.ObjectId;
    description: string;
    image: string;
    likes: Types.ObjectId[];
    comments: IComment[];
    shares: number;
}

export interface IComment {
    user_id: Types.ObjectId;
    text: string;
    createdAt: Date;
}

export interface IPostResponse {
    _id: string;
    user_id: string;
    description: string;
    image: string;
    likes: string[];
    comments: ICommentResponse[];
    shares: number;
    createdAt: string;
    updatedAt: string;
}

export interface ICommentResponse {
    user_id: string;
    text: string;
    createdAt: string;
}

// Conversation types
export interface IConversation extends BaseDocument {
    members: Types.ObjectId[];
}

export interface IConversationResponse {
    _id: string;
    members: string[];
    createdAt: string;
    updatedAt: string;
}

// Message types
export interface IMessage extends BaseDocument {
    conversation_id: Types.ObjectId;
    sender_id: Types.ObjectId;
    text: string;
}

// Session types
export interface ISession extends BaseDocument {
    user_id: Types.ObjectId;
    session_id: string;
    expires_at: Date;
    created_at: Date;
    last_accessed: Date;
    user_agent?: string;
    ip_address?: string;
    is_active: boolean;
}

export interface IMessageResponse {
    _id: string;
    conversation_id: string;
    sender_id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
}

// Request/Response types
export interface AuthRequest extends Request {
    body: {
        username?: string;
        email: string;
        password: string;
    };
}

export interface UserRequest extends Request {
    body: {
        user_id: string;
        isAdmin?: boolean;
        password?: string;
        pic?: string;
    };
    params: {
        id: string;
        user_id?: string;
    };
    query: {
        user_id?: string;
        username?: string;
        name?: string;
    };
}

export interface PostRequest extends Request {
    body: {
        user_id: string;
        description: string;
        image?: string;
    };
    params: {
        id: string;
        username?: string;
    };
}

export interface ConversationRequest extends Request {
    body: {
        sender_id: string;
        receiver_id: string;
    };
    params: {
        user_id: string;
        first_user_id?: string;
        second_user_id?: string;
    };
}

export interface MessageRequest extends Request {
    body: {
        conversation_id: string;
        sender_id: string;
        text: string;
    };
    params: {
        conversation_id: string;
    };
}

// Socket types
export interface SocketUser {
    user_id: string;
    socket_id: string;
}

export interface SocketMessage {
    sender_id: string;
    receiver_id: string;
    text: string;
}

export interface SocketMessageResponse {
    sender_id: string;
    text: string;
}

// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface UserSearchResponse {
    users: Array<{
        username: string;
        profilePicture: string;
        email: string;
        id: string;
    }>;
}

export interface FriendListResponse {
    _id: string;
    username: string;
    profilePicture: string;
}

// Environment types
export interface EnvironmentVariables {
    PORT: string;
    MONGO_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
}

// Database types
export interface DatabaseConfig {
    url: string;
    options: {
        useNewUrlParser: boolean;
        useUnifiedTopology: boolean;
    };
}

// Socket configuration types
export interface SocketConfig {
    cors: {
        origin: string;
        methods: string[];
    };
}

// Error types
export interface AppError extends Error {
    statusCode: number;
    isOperational: boolean;
}

// Controller types
export interface ControllerResponse {
    success: boolean;
    data?: any;
    message?: string;
    statusCode: number;
}

// Middleware types
export interface AuthenticatedRequest extends Request {
    user?: IUserResponse;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}; 