import { createContext, useContext, useEffect, useState } from 'react';

export function usePeer(id: string) {
    const [peer, setPeer] = useState<any>();

    useEffect(() => {
        (async () => {
            const Peer = (await import('peerjs')).default;
            const p = new Peer(id);
            p.on('open', (id) => {
                console.log('My peer ID is: ' + id);
                setPeer(p);
            });
        })();
    }, [id]);

    return peer;
}

export const PeerContext = createContext<any | undefined>(undefined);

export function usePeerContext() {
    const peer = useContext(PeerContext);
    if (!peer) {
        throw new Error('PeerContext not found');
    }
    return peer;
}
