import { Types } from 'mongoose';
import { IUser, IUserResponse, IPost, IPostResponse, IConversation, IConversationResponse, IMessage, IMessageResponse } from '../types';

/**
 * Convert ObjectId to string
 */
export const objectIdToString = (id: Types.ObjectId): string => id.toString();

/**
 * Convert array of ObjectIds to array of strings
 */
export const objectIdsToStrings = (ids: Types.ObjectId[]): string[] =>
    ids.map(id => id.toString());

/**
 * Transform user document to response type
 */
export const transformUserToResponse = (user: IUser): IUserResponse => {
    const userObj = user.toObject();
    return {
        _id: userObj._id.toString(),
        username: userObj.username,
        email: userObj.email,
        profilePicture: userObj.profilePicture,
        coverPicture: userObj.coverPicture,
        followers: objectIdsToStrings(userObj.followers),
        following: objectIdsToStrings(userObj.following),
        isAdmin: userObj.isAdmin,
        description: userObj.description,
        city: userObj.city,
        from: userObj.from,
        relationship: userObj.relationship,
        createdAt: userObj.createdAt.toISOString(),
        updatedAt: userObj.updatedAt.toISOString(),
    };
};

/**
 * Transform post document to response type
 */
export const transformPostToResponse = (post: IPost): IPostResponse => {
    const postObj = post.toObject();
    return {
        _id: postObj._id.toString(),
        user_id: postObj.user_id.toString(),
        description: postObj.description,
        image: postObj.image,
        likes: objectIdsToStrings(postObj.likes),
        comments: postObj.comments.map((comment: { user_id: Types.ObjectId; text: string; createdAt: Date }) => ({
            user_id: comment.user_id.toString(),
            text: comment.text,
            createdAt: comment.createdAt.toISOString(),
        })),
        shares: postObj.shares,
        createdAt: postObj.createdAt.toISOString(),
        updatedAt: postObj.updatedAt.toISOString(),
    };
};

/**
 * Transform conversation document to response type
 */
export const transformConversationToResponse = (conversation: IConversation): IConversationResponse => {
    const convObj = conversation.toObject();
    return {
        _id: convObj._id.toString(),
        members: objectIdsToStrings(convObj.members),
        createdAt: convObj.createdAt.toISOString(),
        updatedAt: convObj.updatedAt.toISOString(),
    };
};

/**
 * Transform message document to response type
 */
export const transformMessageToResponse = (message: IMessage): IMessageResponse => {
    const msgObj = message.toObject();
    return {
        _id: msgObj._id.toString(),
        conversation_id: msgObj.conversation_id.toString(),
        sender_id: msgObj.sender_id.toString(),
        text: msgObj.text,
        createdAt: msgObj.createdAt.toISOString(),
        updatedAt: msgObj.updatedAt.toISOString(),
    };
};

/**
 * Transform user document without sensitive data
 */
export const transformUserToSafeResponse = (user: IUser): Omit<IUserResponse, 'password'> => {
    const userObj = user.toObject();
    const { password, __v, ...safeUser } = userObj;
    return {
        _id: safeUser._id.toString(),
        username: safeUser.username,
        email: safeUser.email,
        profilePicture: safeUser.profilePicture,
        coverPicture: safeUser.coverPicture,
        followers: objectIdsToStrings(safeUser.followers),
        following: objectIdsToStrings(safeUser.following),
        isAdmin: safeUser.isAdmin,
        description: safeUser.description,
        city: safeUser.city,
        from: safeUser.from,
        relationship: safeUser.relationship,
        createdAt: safeUser.createdAt.toISOString(),
        updatedAt: safeUser.updatedAt.toISOString(),
    };
}; 