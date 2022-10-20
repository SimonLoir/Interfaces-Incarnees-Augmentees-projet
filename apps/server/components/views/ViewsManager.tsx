import { useEffect, useState } from 'react';
import { useSocketContext } from '../../pages/_app';
import ScreenShareView from './ScreenShareView';
import StudentsScreenShareView from './StudentsScreenShareView';

const views = [
    { name: 'Partager mon écran', component: ScreenShareView },
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
        <>
            <View />
        </>
    );
}
