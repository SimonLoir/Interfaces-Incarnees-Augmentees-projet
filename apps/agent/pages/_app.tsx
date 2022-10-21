import { AppProps } from 'next/app';
import '../style/index.scss';
import { useSocket, SocketContext } from '@utils/global';

export default function MyApp({ Component, pageProps }: AppProps) {
    const { connected, socket } = useSocket('http://localhost:3000');
    if (!connected) return <div>Connecting...</div>;
    return (
        <SocketContext.Provider value={socket}>
            <Component {...pageProps} />
        </SocketContext.Provider>
    );
}
