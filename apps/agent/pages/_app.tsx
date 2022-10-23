import '../style/index.scss';
import { v4 as uuidv4 } from 'uuid';
import { useSocket, SocketContext, usePeer, PeerContext } from '@utils/global';
import { useState } from 'react';

export default function MyApp({ Component, pageProps }: any) {
    const { connected, socket } = useSocket('http://localhost:3000');
    const [uuid] = useState(uuidv4());
    const peer = usePeer('student-' + uuid);

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
