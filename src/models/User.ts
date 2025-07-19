import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
        profilePicture: {
            type: String,
            default: '',
        },
        coverPicture: {
            type: String,
            default: '',
        },
        followers: {
            type: [Schema.Types.ObjectId],
            default: [],
        },
        following: {
            type: [Schema.Types.ObjectId],
            default: [],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
        },
        city: {
            type: String,
            max: 50,
        },
        from: {
            type: String,
            max: 50,
        },
        relationship: {
            type: Number,
            enum: [1, 2, 3],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IUser>('User', UserSchema); 