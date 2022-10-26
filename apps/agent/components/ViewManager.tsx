import { useSocketContext } from '@utils/global';
import { useEffect, useState } from 'react';
import StudentsScreenSharingView from './StudentScreenSharingView';
import TeacherScreenSharingView from './TeacherScreenSharingView';
import PollStudent from './PollStudent';

const views = {
    teacher_screen_share: <TeacherScreenSharingView></TeacherScreenSharingView>,
    poll: <PollStudent />,
    home: <>Iron Prof - Home Page</>,
    student_screen_share: (
        <StudentsScreenSharingView></StudentsScreenSharingView>
    ),
    qcm: <>QCM</>,
};

export default function ViewManager() {
    const socket = useSocketContext();
    const [viewID, setViewID] = useState<keyof typeof views>('home');

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
