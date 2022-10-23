import { ScreenSelector } from '@components/global';
import { usePeerContext, useSocketContext } from '@utils/global';
import { useEffect, useState } from 'react';

export default function TeacherScreenShareView() {
    const peer = usePeerContext();
    const socket = useSocketContext();

    return (
        <>
            <ScreenSelector
                onSelect={async (source) => {
                    const sourceId = source.id;
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
                }}
            />
        </>
    );
}
