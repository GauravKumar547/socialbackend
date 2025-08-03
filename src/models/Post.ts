import mongoose, { Schema } from 'mongoose';
import { IPost } from '../types';
import User from './User';

const PostSchema: Schema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId || User,
            ref: 'User',
            required: true,
        },
        description: {
            type: String,
            max: 500,
        },
        image: {
            type: String,
        },
        likes: {
            type: [Schema.Types.ObjectId],
            default: [],
        },
        comments: [
            {
                user_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                text: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        shares: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IPost>('Post', PostSchema); 