import { useEffect } from 'react';

export default function Web() {
    useEffect(() => {
        const cb = ({ data }: MessageEvent) => {
            if (data.type === 'sources') {
                console.log(data.sources);
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
        </div>
    );
}
