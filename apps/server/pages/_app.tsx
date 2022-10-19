import { AppProps } from 'next/app';
import { createContext, useContext } from 'react';
import '../style/index.scss';
import { useSocket } from '../utils/sockets';
import { Socket } from 'socket.io-client';

export const SocketContext = createContext<Socket | undefined>(undefined);

export function useSocketContext() {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error('SocketContext not found');
    }
    return socket;
}

export default function MyApp({ Component, pageProps }: AppProps) {
    const { connected, socket } = useSocket();
    if (!connected) return <div>Connecting...</div>;
    return (
        <SocketContext.Provider value={socket}>
            <Component {...pageProps} />
        </SocketContext.Provider>
    );
}
