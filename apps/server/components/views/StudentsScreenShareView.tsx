import { useEffect, useRef, useState } from 'react';
import style from '@style/StudentsScreenShareView.module.scss';
import { usePeerContext, useSocketContext } from '@utils/global';

type current_state = 'waiting' | 'sharing' | 'incoming';

export default function StudentsScreenShareView() {
    const socket = useSocketContext();
    const peer = usePeerContext();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [current, setCurrent] = useState<current_state>('sharing');

    useEffect(() => {
        socket.on('screen-share-proposition', (e) => {
            if (current === 'sharing') return;
            console.log(e);
            setCurrent('incoming');
        });
        peer.on('call', (call: any) => {
            console.log('call incoming', call);
            call.answer();
            call.on('stream', (stream: any) => {
                console.log('stream incoming', stream);
                if (videoRef.current !== null) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () =>
                        videoRef.current?.play();
                }
            });
        });

        peer.on('open', (id: string) => {
            console.log(id);
        });
        console.log(peer);

        return () => {
            socket.off('screen_share_proposition');
            peer.off('call');
            peer.off('open');
        };
    }, [current, socket, peer]);

    if (current === 'waiting')
        return (
            <div className={style.center}>
                <span className='loader'></span>
                <p>En attente d&apos;une demande de partage</p>
            </div>
        );
    return (
        <>
            <video ref={videoRef}></video>
        </>
    );
}
