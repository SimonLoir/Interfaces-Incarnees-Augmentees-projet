import '../style/index.scss';
import { useSocket, SocketContext } from '@utils/global';

export default function MyApp({ Component, pageProps }: any) {
    const { connected, socket } = useSocket();
    if (!connected) return <div>Connecting...</div>;
    return (
        <SocketContext.Provider value={socket}>
            <Component {...pageProps} />
        </SocketContext.Provider>
    );
}
