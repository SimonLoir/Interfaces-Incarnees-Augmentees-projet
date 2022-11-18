import { usePeerContext } from '@utils/global';
import { useEffect, useRef, useState } from 'react';
import { getServerInfo } from 'utils/network';

export default function TeacherScreenSharingView() {
    const peer = usePeerContext();
    const video = useRef<HTMLVideoElement>(null);
    const [streaming, setStreaming] = useState<boolean>(false);

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
        <div className='center'>
            <div>
                <video
                    ref={video}
                    style={{ maxWidth: '80vw', maxHeight: '80vh' }}
                />
            </div>
        </div>
    );
}
