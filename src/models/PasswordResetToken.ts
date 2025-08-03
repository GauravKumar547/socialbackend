import mongoose, { Schema } from 'mongoose';

const PasswordResetTokenSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            index: true,
        },
        token: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expireAfterSeconds: 0 }, // Auto-delete expired tokens
        },
        used: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('PasswordResetToken', PasswordResetTokenSchema); 