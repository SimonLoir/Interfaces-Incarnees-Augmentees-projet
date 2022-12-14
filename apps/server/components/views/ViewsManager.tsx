import { useCallback, useEffect, useState } from 'react';
import { useSocketContext } from '@utils/global';
import QuizMultiChoice from './QuizMultiChoiceView';
import QuizSingleChoice from './QuizSingleChoiceView';
import TeacherScreenShareView from './TeacherScreenShareView';
import StudentsScreenShareView from './StudentsScreenShareView';
import style from '@style/ViewManager.module.scss';
import HomeView from './HomeView';
import Object3dView from './Object3dView';
import DocumentSharingView from './DocumentSharingView';
import PollView from './PollView';
import QCMView from './QCMView';

const views = [
    {
        id: 'teacher_screen_share',
        name: 'Partager mon écran',
        component: TeacherScreenShareView,
    },
    {
        id: 'poll',
        name: 'Sondage',
        component: PollView,
    },
    {
        id: 'object3D',
        name: 'Objet 3D',
        component: function () {
            return <Object3dView isTeacher={true} />;
        },
    },
    { id: 'home', name: 'Accueil', component: HomeView },
    { id: 'document', name: 'Document Share', component: DocumentSharingView },
    { id: 'qcm', name: 'QCM', component: QCMView },
    {
        id: 'student_screen_share',
        name: "Partage d'écran d'étudiants",
        component: StudentsScreenShareView,
    },
];

export default function ViewManager() {
    const socket = useSocketContext();
    const [viewID, setVID] = useState<number | null>(() => {
        const id = localStorage.getItem('viewID');
        if (id) {
            return Number(id);
        }
        return null;
    });
    const setViewID = useCallback(
        (id: number) => {
            setVID(id);
            socket.emit('setView', views[id].id);
        },
        [socket]
    );
    useEffect(() => {
        if (viewID === null && views.length > 0)
            setViewID(Math.floor(views.length / 2));
        socket.on('swipe_right_gesture', () => {
            if (viewID === null) return;
            setViewID((viewID + 1) % views.length);
        });

        socket.on('swipe_left_gesture', () => {
            if (viewID === null) return;
            setViewID((viewID - 1 + views.length) % views.length);
        });

        return () => {
            socket.off('swipe_right_gesture');
            socket.off('swipe_left_gesture');
        };
    }, [viewID, socket, setViewID]);

    useEffect(() => {
        if (viewID === null) return;
        localStorage.setItem('viewID', viewID.toString());
    }, [viewID]);

    if (viewID === null)
        return <>Une erreur est survenue : aucune vue n&apos;a été trouvée</>;

    const View = views[viewID].component as unknown as () => JSX.Element;

    return (
        <div className={style.main}>
            <View />

            <div className={style.controls}>
                {views.map((v, i) => (
                    <span
                        key={i}
                        className={
                            style.item +
                            (i === viewID ? ' ' + style.active : '')
                        }
                        onClick={() => setViewID(i)}
                    >
                        {v.name}
                    </span>
                ))}
            </div>
        </div>
    );
}
