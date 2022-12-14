import { useSocketContext } from '@utils/global';
import { useEffect, useState } from 'react';
import StudentsScreenSharingView from './StudentScreenSharingView';
import TeacherScreenSharingView from './TeacherScreenSharingView';
import PollStudent from './PollStudent';
import QCMStudent from './QCMStudent';
import Object3D from './Object3D';
import HomeScreenView from './HomeScreenView';
import DocumentShareView from './DocumentShareView';
import { getServerInfo } from 'utils/network';

/* eslint-disable camelcase */
const views = {
    teacher_screen_share: <TeacherScreenSharingView />,
    poll: <PollStudent />,
    home: <HomeScreenView />,
    student_screen_share: <StudentsScreenSharingView />,
    qcm: <QCMStudent />,
    object3D: <Object3D />,
    document: <DocumentShareView />,
};
/* eslint-enable camelcase */

const { host, port } = getServerInfo();

export default function ViewManager() {
    const socket = useSocketContext();
    const [viewID, setViewID] = useState<keyof typeof views>('home');

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
        socket.on('new_3d_object', () => {
            setViewID('object3D');
        });
        return () => {
            socket.off('setView');
            socket.off('new_3d_object');
        };
    }, [socket]);

    return views[viewID];
}
