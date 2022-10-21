import { useEffect, useState } from 'react';
import { useSocketContext } from '@utils/global';
import QuizMultiChoice from './QuizMultiChoice';
import QuizSingleChoice from './QuizSingleChoice';
import ScreenShareView from './ScreenShareView';
import StudentsScreenShareView from './StudentsScreenShareView';
import style from '@style/ViewManager.module.scss';

const views = [
    { name: 'Partager mon écran', component: ScreenShareView },
    { name: 'Sondage', component: QuizSingleChoice },
    { name: 'QCM', component: QuizMultiChoice },
    { name: "Partage d'écran d'étudiants", component: StudentsScreenShareView },
];

export default function ViewManager() {
    const socket = useSocketContext();
    const [viewID, setViewID] = useState<number | null>(null);
    useEffect(() => {
        if (viewID === null && views.length > 0) setViewID(0);
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
