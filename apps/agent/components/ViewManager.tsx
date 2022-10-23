import { useSocketContext } from '@utils/global';
import { useEffect, useState } from 'react';
import StudentsScreenSharingView from './StudentScreenSharingView';

const views = {
    teacher_screen_share: <></>,
    poll: <></>,
    home: <></>,
    student_screen_share: (
        <StudentsScreenSharingView></StudentsScreenSharingView>
    ),
    qcm: <></>,
};

export default function ViewManager() {
    const socket = useSocketContext();
    const [viewID, setViewID] = useState<keyof typeof views>('home');

    useEffect(() => {
        socket.on('setView', (view) => {
            console.log(view);
            setViewID(view);
        });

        return () => {
            socket.off('setView');
        };
    }, [socket]);

    return views[viewID];
}
