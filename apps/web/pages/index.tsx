import { useEffect, useState } from 'react';
import DisplayChooser from '../components/displays';

export default function Web() {
    const [sources, setSources] = useState<VideoSource[]>([]);
    useEffect(() => {
        const cb = ({ data }: MessageEvent) => {
            if (data.type === 'sources') {
                const { sources }: { sources: VideoSource[] } = data;
                setSources(
                    sources.filter(
                        (s) => s.thumbnail != 'data:image/png;base64,'
                    )
                );
            }
        };
        window.addEventListener('message', cb);
        return () => window.removeEventListener('message', cb);
    }, []);
    return (
        <div>
            <h1>IronProf Agent</h1>
            <button
                onClick={() => {
                    window.postMessage('get-sources');
                }}
            >
                Get Sources
            </button>
            <DisplayChooser sources={sources} />
        </div>
    );
}
