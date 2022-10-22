import React, { useEffect, useRef } from 'react';

import { usePeerContext } from '@utils/global';

export function ScreenSelector() {
    const peer = usePeerContext();
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        const listener = async ({ data }: any) => {
            if (data.type === 'sources') {
                const { sources } = data;
                const sourceId = sources[0].id;
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
                peer.call('teacher', stream);
                if (ref.current !== null) {
                    ref.current.srcObject = stream;
                    ref.current.onloadedmetadata = () => ref.current?.play();
                }
            }
            console.log('s:', data.sources);
        };
        window.addEventListener('message', listener);
        return () => {
            window.removeEventListener('message', listener);
        };
    }, [peer]);
    return (
        <>
            <button onClick={() => window.postMessage({ type: 'get-sources' })}>
                test
            </button>
            <video src='' ref={ref}></video>
        </>
    );
}
