import { usePeerContext } from '@utils/global';
import { useEffect, useRef } from 'react';
import { getServerInfo } from 'utils/network';

export default function TeacherScreenSharingView() {
    const peer = usePeerContext();
    const video = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const { host, port } = getServerInfo();
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
