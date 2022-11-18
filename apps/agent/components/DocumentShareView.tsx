import { useSocketContext } from '@utils/global';
import { useCallback, useEffect, useState } from 'react';
import { getServerInfo } from 'utils/network';

export default function DocumentShareView() {
    const socket = useSocketContext();
    const [doc, setDocument] = useState<string | null>(null);

    const acceptDocument = useCallback(() => {
        if (!doc) return;
        console.log(doc);
        const a = document.createElement('a');
        const { host, port } = getServerInfo();

        a.href = `http://${host}:${port}/${doc}`;
        a.setAttribute('download', doc);
        a.target = '_blank';
        a.click();
        setDocument(null);
    }, [doc]);

    const rejectDocument = () => {
        setDocument(null);
    };
    useEffect(() => {
        socket.on('document', (data) => {
            setDocument(data);
        });

        socket.on('thumbs_up_gesture', () => {
            acceptDocument();
        });

        socket.on('thumbs_down_gesture', () => {
            rejectDocument();
        });

        return () => {
            socket.off('document');
        };
    }, [socket, acceptDocument]);
    return (
        <div className='center'>
            <div>
                {doc === null ? (
                    <>
                        <span className='loader'></span>
                        <p>En attente d&apos;un document</p>
                    </>
                ) : (
                    <>
                        <div className='yes-no-modal'>
                            <p>
                                Le professeur souhaite partager le document
                                &quot;
                                {doc}&quot;. Voulez-vous le télécharger ?
                            </p>

                            <button onClick={acceptDocument}>Oui 👍</button>
                            <button onClick={rejectDocument}>Non 👎</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
