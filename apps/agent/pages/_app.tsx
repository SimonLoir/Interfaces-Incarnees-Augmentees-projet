import '../style/index.scss';
import { v4 as uuidv4 } from 'uuid';
import { useSocket, SocketContext, usePeer, PeerContext } from '@utils/global';
import { useState } from 'react';

export default function MyApp({ Component, pageProps }: any) {
    const { connected, socket, wasConnected } = useSocket(
        'http://localhost:3000'
    );
    const [uuid] = useState(uuidv4());
    const { peer, error } = usePeer('student-' + uuid, {
        host: process.env.NEXT_PUBLIC_PEER_HOST || 'localhost',
        port: parseInt(process.env.NEXT_PUBLIC_PEER_PORT || '3002'),
        path: '/',
    });

    if (error)
        return <>Impossible de se connecter au serveur de pairs : {error}</>;
    if (!connected)
        return (
            <div className='center'>
                <div>
                    <span className='loader'></span>
                    <p>
                        {wasConnected ? (
                            <>Tentative de reconnexion au serveur</>
                        ) : (
                            <>Connexion au serveur</>
                        )}
                    </p>
                </div>
            </div>
        );
    if (!peer)
        return (
            <div className='center'>
                <div>
                    <span className='loader'></span>
                    <p>Connexion au serveur de pairs</p>
                </div>
            </div>
        );

    return (
        <SocketContext.Provider value={socket}>
            <PeerContext.Provider value={peer}>
                <Component {...pageProps} />
            </PeerContext.Provider>
        </SocketContext.Provider>
    );
}
