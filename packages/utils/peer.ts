import { createContext, useContext, useEffect, useState } from 'react';

class PeerInstance {
    private static promiseInstance: Promise<any>;
    public static getInstance(
        id: string,
        options?: {
            host?: string;
            port?: number;
            path?: string;
            secure?: boolean;
        }
    ) {
        if (!PeerInstance.promiseInstance)
            PeerInstance.promiseInstance = new Promise(
                async (resolve, reject) => {
                    const Peer = (await import('peerjs')).default;
                    const p = new Peer(id, options);
                    p.on('open', (id) => {
                        console.log('My peer ID is: ' + id);
                        resolve(p);
                    });

                    p.on('error', (err) => {
                        console.error(err);
                        reject(err);
                    });
                }
            );
        return PeerInstance.promiseInstance;
    }
}

export function usePeer(
    id: string,
    options?: { host?: string; port?: number; path?: string; secure?: boolean }
) {
    const [peer, setPeer] = useState<any>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        (async () => {
            try {
                const p = await PeerInstance.getInstance(id, options);
                setPeer(p);
            } catch (error) {
                setPeer(undefined);
                setError(String(error));
            }
        })();
    }, [id, options]);

    return { peer, error };
}

export const PeerContext = createContext<any | undefined>(undefined);

export function usePeerContext() {
    const peer = useContext(PeerContext);
    if (!peer) {
        throw new Error('PeerContext not found');
    }
    return peer;
}
