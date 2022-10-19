import { useEffect, useState } from 'react';
import { useSocketContext } from './_app';

export default function IndexPage() {
    const socket = useSocketContext();
    const [time, setTime] = useState<string | null>(null);
    useEffect(() => {
        console.log(socket);
        socket.on('time', (time: string) => {
            console.log(time);
            setTime(time);
        });
    }, [socket]);
    return (
        <>
            <button onClick={() => socket.emit('message', 'Hello world')}>
                send message
            </button>
            {time}
        </>
    );
}
