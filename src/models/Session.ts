import mongoose, { Schema } from 'mongoose';
import { ISession } from '../types';

const SessionSchema: Schema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        session_id: {
            type: String,
            required: true,
            unique: true,
        },
        expires_at: {
            type: Date,
            required: true,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
        last_accessed: {
            type: Date,
            default: Date.now,
        },
        user_agent: {
            type: String,
        },
        ip_address: {
            type: String,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for performance
SessionSchema.index({ user_id: 1 });
SessionSchema.index({ expires_at: 1 });

export default mongoose.model<ISession>('Session', SessionSchema); 