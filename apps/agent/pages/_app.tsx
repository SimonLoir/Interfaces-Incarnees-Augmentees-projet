import '../style/index.scss';
import { useSocket, SocketContext, usePeer, PeerContext } from '@utils/global';

export default function MyApp({ Component, pageProps }: any) {
    const { connected, socket } = useSocket('http://localhost:3000');
    const peer = usePeer('student');

    if (!connected) return <div>Connecting...</div>;
    if (!peer) return <div>Connecting to peer...</div>;

    return (
        <SocketContext.Provider value={socket}>
            <PeerContext.Provider value={peer}>
                <Component {...pageProps} />
            </PeerContext.Provider>
        </SocketContext.Provider>
    );
}
