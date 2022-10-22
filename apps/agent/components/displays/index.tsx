import { useEffect, useState } from 'react';
import Source from './Source';
import style from '@style/DisplayChooser.module.scss';
import { getAt } from '@utils/global';

export default function DisplayChooser({
    sources,
}: {
    sources: VideoSource[];
}) {
    const [selected, setSelected] = useState<VideoSource | null>(null);

    useEffect(() => {
        if (sources.length === 0) return setSelected(null);
        if (selected === null) return setSelected(sources[0]);
        if (sources.find((s) => s.id === selected.id) === undefined)
            return setSelected(sources[0]);
    }, [sources, selected]);

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
            <Source source={selected} selected={true} onClick={() => {}} />
            <Source
                source={nextSource}
                onClick={() => setSelected(nextSource)}
            />
        </div>
    );
}
