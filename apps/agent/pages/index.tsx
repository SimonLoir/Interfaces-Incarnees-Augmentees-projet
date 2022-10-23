import { ScreenSelector } from '@components/global';
import { usePeerContext, useSocketContext } from '@utils/global';
import { useEffect, useState } from 'react';
type status = 'waiting' | 'streaming' | 'sent';

export default function Index() {
    const [status, setStatus] = useState<status>('waiting');
    const peer = usePeerContext();
    const socket = useSocketContext();

    useEffect(() => {
        socket.on('screen_share_accepted', (shared_id) => {
            if (shared_id === peer.id) setStatus('streaming');
            else {
                setStatus('waiting');
            }
        });

        socket.on('screen_share_refused', (shared_id) => {
            if (shared_id === peer.id) setStatus('waiting');
        });

        return () => {
            socket.off('screen_share_accepted');
            socket.off('screen_share_refused');
        };
    }, [socket, peer]);

    if (status === 'sent') {
        return (
            <div>
                <p>En attente de réponse</p>
            </div>
        );
    }

    if (status === 'waiting')
        return (
            <>
                <ScreenSelector
                    onSelect={async (source) => {
                        const sourceId = source.id;
                        const stream =
                            await navigator.mediaDevices.getUserMedia({
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
                        peer.call('teacher', stream);
                        setStatus('sent');
                    }}
                />
            </>
        );
    return <> Vous êtes en train de partager votre écran</>;
}
