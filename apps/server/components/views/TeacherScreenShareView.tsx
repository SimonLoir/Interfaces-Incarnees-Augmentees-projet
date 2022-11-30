import { ScreenSelector } from '@components/global';
import { usePeerContext, useSocketContext } from '@utils/global';
import { useEffect, useState } from 'react';

export default function TeacherScreenShareView() {
    const [peers, setPeers] = useState<string[]>([]);
    const [calls, setCalls] = useState<any[]>([]);
    const [streamx, setStream] = useState<MediaStream>();
    const peer = usePeerContext();
    const socket = useSocketContext();
    const [streaming, setStreaming] = useState(false);

    useEffect(() => {
        socket.on('new-peer', (peerid) => {
            setPeers((peers) =>
                peers.indexOf(peerid) >= 0 ? peers : [...peers, peerid]
            );
        });

        return () => {
            socket.off('new-peer');
        };
    }, [socket]);

    useEffect(() => {
        return () => {
            streamx?.getTracks().forEach((track) => track.stop());
            calls.map((call) => call.close());
        };
    }, []);

    return (
        <div className='center'>
            {streaming === false
                ? 'Vous ne partagez pas votre écran'
                : 'Vous partagez votre écran'}
            <ScreenSelector
                onSelect={async (source) => {
                    const sourceId = source.id;
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: {
                            //@ts-ignore
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: sourceId,
                                minWidth: 1280,
                                maxWidth: 1280,
                                minHeight: 720,
                                maxHeight: 720,
                            },
                        },
                    });

                    if (calls.length > 0) {
                        calls.forEach((c) => c.close());
                        setCalls([]);
                    }

                    if (streamx) streamx.getTracks().forEach((t) => t.stop());

                    peers.forEach((peerid) => {
                        const call = peer.call(peerid, stream);
                        call.on('stream', (stream: MediaStream) => {});
                        setCalls((calls) => [...calls, call]);
                    });

                    setStreaming(true);
                }}
            />
        </div>
    );
}
