import { useEffect, useState, createContext, useContext } from 'react';
import { Socket, io } from 'socket.io-client';

export function useSocket(url: string = 'http://localhost:3001') {
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState<Socket>();
    useEffect(() => {
        const s = SocketClient.getInstance(url);

        setSocket(s);

        s.on('connect', () => {
            setConnected(true);
        });

        s.on('disconnect', () => {
            setConnected(false);
        });
        return () => {
            s.off('disconnect');
            s.off('connect');
        };
    }, []);

    return { connected, socket };
}

export default class SocketClient {
    private static socket: Socket;
    public static getInstance(url: string = 'http://localhost:3001'): Socket {
        if (!this.socket) this.socket = io(url);
        return this.socket;
    }
}

export const SocketContext = createContext<Socket | undefined>(undefined);

export function useSocketContext() {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error('SocketContext not found');
    }
    return socket;
}
