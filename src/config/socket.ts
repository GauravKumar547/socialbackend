import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { SocketUser, SocketMessage, SocketMessageResponse } from '../types';

let users: SocketUser[] = [];

const addUser = (user_id: string, socket_id: string): void => {
    if (!users.some((user) => user.user_id === user_id)) {
        users.push({ user_id, socket_id });
    }
};

const removeUser = (socket_id: string): void => {
    users = users.filter((user) => user.socket_id !== socket_id);
};

const getUser = (user_id: string): SocketUser | undefined => {
    return users.find((user) => user.user_id === user_id);
};

const initializeSocket = (server: HTTPServer): SocketIOServer => {
    const socketIO = new SocketIOServer(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
        },
    });

    socketIO.on('connection', (socket: Socket) => {
        // connection established
        console.log('user connected');

        // take user_id and socket id from user
        socket.on('addUser', (user_id: string) => {
            addUser(user_id, socket.id);
            socketIO.emit('getUsers', users);
        });

        // send and get message
        socket.on('sendMessage', ({ sender_id, receiver_id, text }: SocketMessage) => {
            const user = getUser(receiver_id);
            if (user) {
                socketIO.to(user.socket_id).emit('getMessage', {
                    sender_id,
                    text,
                } as SocketMessageResponse);
            }
        });

        // get disconnected
        socket.on('disconnect', () => {
            console.log('user disconnected');
            removeUser(socket.id);
            socketIO.emit('getUsers', users);
        });
    });

    return socketIO;
};

export { initializeSocket }; 