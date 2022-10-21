import { useEffect, useState } from 'react';
import style from '@style/StudentsScreenShareView.module.scss';
import { useSocketContext } from '@utils/global';

type current_state = 'waiting' | 'sharing' | 'incoming';

export default function StudentsScreenShareView() {
    const socket = useSocketContext();
    const [current, setCurrent] = useState<current_state>('waiting');

    useEffect(() => {
        socket.on('screen-share-proposition', (e) => {
            if (current === 'sharing') return;
            console.log(e);
            setCurrent('incoming');
        });
        return () => {
            socket.off('screen_share_proposition');
        };
    }, [current, socket]);

    if (current === 'waiting')
        return (
            <div className={style.center}>
                <span className='loader'></span>
                <p>En attente d&apos;une demande de partage</p>
            </div>
        );
    return <>Screen sharing for students</>;
}
