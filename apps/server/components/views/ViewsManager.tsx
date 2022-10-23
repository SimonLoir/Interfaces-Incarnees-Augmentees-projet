import { useEffect, useState } from 'react';
import { useSocketContext } from '@utils/global';
import QuizMultiChoice from './QuizMultiChoiceView';
import QuizSingleChoice from './QuizSingleChoiceView';
import ScreenShareView from './ScreenShareView';
import StudentsScreenShareView from './StudentsScreenShareView';
import style from '@style/ViewManager.module.scss';
import HomeView from './HomeView';

const views = [
    {
        id: 'teacher_screen_share',
        name: 'Partager mon écran',
        component: ScreenShareView,
    },
    {
        id: 'poll',
        name: 'Sondage',
        component: QuizSingleChoice,
    },
    { id: 'home', name: 'Accueil', component: HomeView },
    { id: 'qcm', name: 'QCM', component: QuizMultiChoice },
    {
        id: 'student_screen_share',
        name: "Partage d'écran d'étudiants",
        component: StudentsScreenShareView,
    },
];

export default function ViewManager() {
    const socket = useSocketContext();
    const [viewID, setVID] = useState<number | null>(null);
    const setViewID = (id: number) => {
        setVID(id);
        socket.emit('setView', views[id].id);
    };
    useEffect(() => {
        if (viewID === null && views.length > 0)
            setViewID(Math.floor(views.length / 2));
        socket.on('next-view', () => {
            if (viewID === null) return;
            setViewID((viewID + 1) % views.length);
        });

        socket.on('previous-view', () => {
            if (viewID === null) return;
            setViewID((viewID - 1 + views.length) % views.length);
        });

        return () => {
            socket.off('next-view');
            socket.off('previous-view');
        };
    }, [viewID, socket]);

    if (viewID === null)
        return <>Une erreur est survenue : aucune vue n&apos;a été trouvée</>;

    const View = views[viewID].component;
    return (
        <div className={style.main}>
            <div>
                <View />
            </div>
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
