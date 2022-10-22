import '@style/index.scss';
import '@style/loader.scss';
import { useSocket, SocketContext, usePeer, PeerContext } from '@utils/global';

export default function MyApp({ Component, pageProps }: any) {
    const { connected, socket } = useSocket();
    const peer = usePeer('teacher');
    if (!peer) return <>Loading peer connection</>;
    if (!connected) return <div>Connecting...</div>;
    return (
        <SocketContext.Provider value={socket}>
            <PeerContext.Provider value={peer}>
                <Component {...pageProps} />
            </PeerContext.Provider>
        </SocketContext.Provider>
    );
}
