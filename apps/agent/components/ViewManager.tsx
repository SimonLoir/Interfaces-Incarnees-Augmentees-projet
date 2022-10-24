import { useSocketContext } from '@utils/global';
import { useEffect, useState } from 'react';
import StudentsScreenSharingView from './StudentScreenSharingView';
import TeacherScreenSharingView from './TeacherScreenSharingView';

const views = {
    teacher_screen_share: <TeacherScreenSharingView></TeacherScreenSharingView>,
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
    console.log('render :' + viewID);
    return views[viewID];
}
