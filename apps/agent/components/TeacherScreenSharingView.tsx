import { usePeerContext } from '@utils/global';
import { useEffect, useRef, useState } from 'react';

export default function TeacherScreenSharingView() {
    const peer = usePeerContext();
    const video = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const host = process.env.NEXT_PUBLIC_SERVER_HOST || 'localhost';
        const port = process.env.NEXT_PUBLIC_SERVER_PORT || '3001';
        fetch(`http://${host}:${port}/connect/` + peer.id);
    }, [peer]);

    useEffect(() => {
        peer.on('call', (call: any) => {
            call.answer();
            call.on('stream', (stream: MediaStream) => {
                if (!video.current) return;
                video.current.srcObject = stream;
                video.current.play();
            });
        });
        return () => {
            peer.off('call');
        };
    }, [peer]);
    return (
        <>
            <video src='' ref={video}></video>
        </>
    );
}
