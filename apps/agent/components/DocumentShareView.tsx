import { useSocketContext } from '@utils/global';
import { useCallback, useEffect, useState } from 'react';
import { getServerInfo } from 'utils/network';

export default function DocumentShareView() {
    const socket = useSocketContext();
    const [doc, setDocument] = useState<string | null>(null);

    const acceptDocument = useCallback(() => {
        if (!doc) return;
        console.log(doc);

        const { host, port } = getServerInfo();
        fetch(`http://${host}:${port}/${doc}`)
            .then((res) => res.blob())
            .then((res) => {
                const a = document.createElement('a');
                a.setAttribute('download', doc);
                const href = URL.createObjectURL(res);
                a.setAttribute('href', href);
                a.setAttribute('target', '_blank');
                a.click();
                URL.revokeObjectURL(href);
                setDocument(null);
            })
            .catch((e) => {
                alert(
                    'Une erreur est survenue lors du téléchargement du document'
                );
                console.error(e);
                setDocument(null);
            });
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
            socket.off('thumbs_up_gesture');
            socket.off('thumbs_down_gesture');
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
