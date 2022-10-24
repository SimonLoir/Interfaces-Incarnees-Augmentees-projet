import { createContext, useContext, useEffect, useState } from 'react';

export function usePeer(
    id: string,
    options?: { host?: string; port?: number; path?: string; secure?: boolean }
) {
    const [peer, setPeer] = useState<any>();

    useEffect(() => {
        console.log('usePeer', id);
        (async () => {
            const Peer = (await import('peerjs')).default;
            const p = new Peer(id, options);
            console.log(Peer, p);
            p.on('open', (id) => {
                console.log('My peer ID is: ' + id);
                setPeer(p);
            });

            p.on('error', (err) => {
                console.error(err);
            });
        })();
    }, [id, options]);

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
