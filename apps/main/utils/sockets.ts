import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState<Socket>();
    useEffect(() => {
        const s = SocketClient.getInstance();

        setSocket(s);

        s.on('connect', () => {
            setConnected(true);
        });

        s.on('disconnect', () => {
            setConnected(false);
        });
    }, []);

    return { connected, socket };
}

export default class SocketClient {
    private static socket: Socket;
    public static getInstance() {
        if (!this.socket) this.socket = io();
        return this.socket;
    }
}
