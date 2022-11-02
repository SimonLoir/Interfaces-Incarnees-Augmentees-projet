import { useCallback, useEffect, useRef, useState } from 'react';
import style from '@style/StudentsScreenShareView.module.scss';
import { usePeerContext, useSocketContext } from '@utils/global';

type current_state = 'waiting' | 'sharing' | 'incoming';

export default function StudentsScreenShareView() {
    const socket = useSocketContext();
    const peer = usePeerContext();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [current, setCurrent] = useState<current_state>('waiting');
    const [queue, setQueue] = useState<any[]>([]);

    const acceptScreenShare = useCallback(() => {
        const call = queue[0];
        call.answer();
        setCurrent('sharing');
        socket.emit('screen_share_accepted', call.peer);
        call.on('stream', (stream: any) => {
            console.log('stream', stream);
            console.log('videoRef', videoRef.current);
            setTimeout(() => {
                if (videoRef.current !== null) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () =>
                        videoRef.current?.play();
                }
            }, 500);
        });
        setQueue((q) => q.slice(1));
        console.log('call answer', call);
    }, [queue, socket]);

    const rejectScreenShare = useCallback(() => {
        const call = queue[0];
        setQueue((q) => q.slice(1));
        if (queue.length === 1) setCurrent('waiting');

        socket.emit('screen_share_refused', call.peer);
    }, [queue, socket]);

    useEffect(() => {
        peer.on('call', (call: any) => {
            console.log('call incoming', call);
            if (current === 'sharing') return;
            setQueue((q) => [...q, call]);
            setCurrent('incoming');
        });

        return () => {
            peer.off('call');
        };
    }, [current, peer]);

    useEffect(() => {
        if (current === 'incoming' && queue.length > 0) {
            socket.on('thumbs_up_gesture', () => {
                acceptScreenShare();
            });
            socket.on('thumbs_down_gesture', () => {
                rejectScreenShare();
            });
        }
        return () => {
            socket.off('thumbs_up_gesture');
            socket.off('thumbs_down_gesture');
        };
    }, [current, queue, socket, acceptScreenShare, rejectScreenShare]);

    useEffect(() => {
        if (queue.length === 0 && current !== 'sharing') setCurrent('waiting');
    }, [queue, current]);

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
                <button onClick={acceptScreenShare}>Accepter</button>
                <button onClick={rejectScreenShare}>Refuser</button>
            </div>
        );
    }

    return (
        <div className={style.videoMain}>
            <video ref={videoRef}></video>
        </div>
    );
}
