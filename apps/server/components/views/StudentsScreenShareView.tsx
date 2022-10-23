import { useEffect, useRef, useState } from 'react';
import style from '@style/StudentsScreenShareView.module.scss';
import { usePeerContext, useSocketContext } from '@utils/global';

type current_state = 'waiting' | 'sharing' | 'incoming';

export default function StudentsScreenShareView() {
    const socket = useSocketContext();
    const peer = usePeerContext();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [current, setCurrent] = useState<current_state>('waiting');
    const [queue, setQueue] = useState<any[]>([]);

    useEffect(() => {
        if (queue.length === 0 && current !== 'sharing') setCurrent('waiting');

        peer.on('call', (call: any) => {
            console.log('call incoming', call);
            if (current === 'sharing') return;
            setQueue((q) => [...q, call]);
            setCurrent('incoming');
        });

        return () => {
            socket.off('screen_share_proposition');
            peer.off('call');
        };
    }, [current, socket, peer, queue]);

    if (current === 'waiting')
        return (
            <div className={style.center}>
                <span className='loader'></span>
                <p>En attente d&apos;une demande de partage</p>
            </div>
        );
    else if (current === 'incoming') {
        const call = queue[0];
        return (
            <div className={style.center}>
                <p>{call.peer} veut partager son écran</p>
                <button
                    onClick={() => {
                        call.answer();
                        socket.emit('screen_share_accepted', call.peer);
                        call.on('stream', (stream: any) => {
                            if (videoRef.current !== null) {
                                videoRef.current.srcObject = stream;
                                videoRef.current.onloadedmetadata = () =>
                                    videoRef.current?.play();
                            }
                        });
                        console.log('call answer', call);
                        setCurrent('sharing');
                        setQueue((q) => q.slice(1));
                    }}
                >
                    Accepter
                </button>
                <button
                    onClick={() => {
                        setQueue((q) => q.slice(1));
                        if (queue.length === 1) setCurrent('waiting');

                        socket.emit('screen_share_refused', call.peer);
                    }}
                >
                    Refuser
                </button>
            </div>
        );
    }

    return (
        <>
            <video ref={videoRef}></video>
        </>
    );
}
