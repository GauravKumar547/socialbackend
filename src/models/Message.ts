import mongoose, { Schema } from 'mongoose';
import { IMessage } from '../types';

const MessageSchema: Schema = new Schema(
    {
        conversation_id: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        sender_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IMessage>('Message', MessageSchema); 