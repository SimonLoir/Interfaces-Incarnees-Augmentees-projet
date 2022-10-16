import { useEffect, useState } from 'react';

export default function Web() {
    const [sources, setSources] = useState<VideoSource[]>([]);
    useEffect(() => {
        const cb = ({ data }: MessageEvent) => {
            if (data.type === 'sources') {
                const { sources }: { sources: VideoSource[] } = data;
                setSources(sources);
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
            {sources.map((source) => (
                <div key={source.id}>
                    <h2>{source.name}</h2>
                    <img src={source.thumbnail} alt='Source' />
                </div>
            ))}
        </div>
    );
}
