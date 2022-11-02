import { getAt, useSocketContext } from '@utils/global';
import React, { useEffect, useState } from 'react';
import Source from './Source';
import style from './style/DisplayChooser.module.scss';

export interface VideoSource {
    name: string;
    id: string;
    thumbnail: string;
}

export function ScreenSelector({
    onSelect,
}: {
    onSelect: (source: VideoSource) => void;
}) {
    const socket = useSocketContext();
    const [sources, setSources] = useState<VideoSource[]>([]);
    const [selected, setSelected] = useState<VideoSource | null>(null);

    useEffect(() => {
        window.postMessage({ type: 'get-sources' });
        const listener = async ({ data }: any) => {
            if (data.type === 'sources') {
                setSources(data.sources);
                console.log(data.sources);
            }
        };

        window.addEventListener('message', listener);
        return () => {
            window.removeEventListener('message', listener);
        };
    }, []);

    useEffect(() => {
        if (sources.length === 0) return setSelected(null);
        if (selected === null) return setSelected(sources[0]);
        if (sources.find((s) => s.id === selected.id) === undefined)
            return setSelected(sources[0]);
    }, [sources, selected]);

    useEffect(() => {
        socket.on('screen_share_gesture', () => {
            if (selected !== null) onSelect(selected);
        });
        return () => {
            socket.off('screen_share_gesture');
        };
    }, [onSelect, socket, selected]);

    if (selected === null) return <div>Impossible de trouver un écran</div>;

    const index = sources.findIndex((s) => s.id === selected.id);
    const previousSource = getAt(sources, index - 1);
    const nextSource = getAt(sources, index + 1);

    return (
        <div className={style.main}>
            <Source
                source={previousSource}
                onClick={() => setSelected(previousSource)}
            />
            <Source
                source={selected}
                selected={true}
                onClick={() => {
                    onSelect(selected);
                }}
            />
            <Source
                source={nextSource}
                onClick={() => setSelected(nextSource)}
            />
        </div>
    );
}
