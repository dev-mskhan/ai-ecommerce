import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(import.meta.env.VITE_API_URL, {
            autoConnect: false,
            withCredentials: true,
        });
    }
    return socket;
};

export const connectSocket = () => {
    const s = getSocket();
    s.connect();
    return s;
};

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};