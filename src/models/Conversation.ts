import mongoose, { Schema } from 'mongoose';
import { IConversation } from '../types';

const ConversationSchema: Schema = new Schema(
    {
        members: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IConversation>('Conversation', ConversationSchema); 