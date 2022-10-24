import { usePeerContext } from '@utils/global';
import { useEffect, useRef, useState } from 'react';

export default function TeacherScreenSharingView() {
    const peer = usePeerContext();
    const video = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        fetch('http://localhost:3001/connect/' + peer.id);
    }, [peer]);

    useEffect(() => {
        peer.on('call', (call: any) => {
            console.log('call');
            call.answer();
            call.on('stream', (stream: MediaStream) => {
                console.log('stream');
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
            Teacher stream
            <video src='' ref={video}></video>
        </>
    );
}
