import { ScreenSelector } from '@components/global';
import { usePeerContext, useSocketContext } from '@utils/global';
import { useEffect, useState } from 'react';
type status = 'waiting' | 'streaming' | 'sent';

export default function StudentsScreenSharingView() {
    const [status, setStatus] = useState<status>('waiting');
    const peer = usePeerContext();
    const socket = useSocketContext();
    const [call, setCall] = useState<any>(null);
    const [stream, setStream] = useState<MediaStream>();

    useEffect(() => {
        socket.on('screen_share_accepted', (sharerId) => {
            if (sharerId === peer.id) setStatus('streaming');
            else {
                setStatus('waiting');
            }
        });

        socket.on('screen_share_refused', (sharerId) => {
            if (sharerId === peer.id) setStatus('waiting');
        });

        return () => {
            socket.off('screen_share_accepted');
            socket.off('screen_share_refused');
            call?.close();
        };
    }, [socket, peer, call]);

    useEffect(() => {
        return () => {
            stream?.getTracks().forEach((track) => track.stop());
            call?.close();
        };
    }, []);

    if (status === 'sent') {
        return (
            <div className='center'>
                <div>
                    <span className='loader'></span>
                    <p>En attente de réponse</p>
                </div>
            </div>
        );
    }

    if (status === 'waiting')
        return (
            <div className='center'>
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
                        setCall(peer.call('teacher', stream));
                        setStatus('sent');
                        setStream(stream);
                    }}
                />
            </div>
        );
    return (
        <div className='center'>
            {' '}
            <div>Vous êtes en train de partager votre écran</div>
        </div>
    );
}
