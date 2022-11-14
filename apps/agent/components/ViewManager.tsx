import { useSocketContext } from '@utils/global';
import { useEffect, useState } from 'react';
import StudentsScreenSharingView from './StudentScreenSharingView';
import TeacherScreenSharingView from './TeacherScreenSharingView';
import PollStudent from './PollStudent';
import QCMStudent from './QCMStudent';
import Object3D from './Object3D';
import HomeScreenView from './HomeScreenView';

/* eslint-disable camelcase */
const views = {
    teacher_screen_share: <TeacherScreenSharingView />,
    poll: <PollStudent />,
    home: <HomeScreenView />,
    student_screen_share: <StudentsScreenSharingView />,
    qcm: <QCMStudent />,
    object3D: <Object3D />,
};
/* eslint-enable camelcase */

export default function ViewManager() {
    const socket = useSocketContext();
    const [viewID, setViewID] = useState<keyof typeof views>('home');

    const host = process.env.NEXT_PUBLIC_SERVER_HOST || 'localhost';
    const port = process.env.NEXT_PUBLIC_SERVER_PORT || '3001';

    useEffect(() => {
        //Instead of broadcasting current view every second, lets the client ask for the current view
        //To avoid delay (shorten it as much as possible)
        fetch(`http://${host}:${port}/current-view`)
            .then((res) => res.text())
            .then((view) => setViewID(view as any));
    });

    useEffect(() => {
        socket.on('setView', (view) => {
            setViewID(view);
        });

        return () => {
            socket.off('setView');
        };
    }, [socket]);

    return views[viewID];
}
