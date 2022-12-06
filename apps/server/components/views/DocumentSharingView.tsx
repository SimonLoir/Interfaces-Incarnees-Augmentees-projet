import { useSocketContext } from '@utils/global';
import { useCallback, useEffect, useState } from 'react';
import style from '@style/DocumentSharing.module.scss';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

const useAvailableFiles = () => {
    const [files, setFiles] = useState<string[]>([]);
    useEffect(() => {
        fetch('/files.json')
            .then((res) => res.json())
            .then(setFiles)
            .catch(console.error);
    }, []);
    return files;
};

export default function DocumentSharingView() {
    const socket = useSocketContext();
    const files = useAvailableFiles();
    console.log(files);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const sendSelectedFile = useCallback(() => {
        if (selectedFile) {
            socket.emit('document', selectedFile);
            setSelectedFile(null);
        }
    }, [selectedFile, socket]);

    useEffect(() => {
        socket.on('extended_fingers_gesture', (id) => {
            if (files.length > id) setSelectedFile(files[id]);
        });

        socket.on('thumbs_up_gesture', sendSelectedFile);
        socket.on('thumbs_down_gesture', () => setSelectedFile(null));

        return () => {
            socket.off('extended_fingers_gesture');
            socket.off('thumbs_up_gesture', sendSelectedFile);
            socket.off('thumbs_down_gesture');
        };
    }, [files, socket, sendSelectedFile]);

    if (selectedFile !== null)
        return (
            <div className='center'>
                <div className='yes-no-modal'>
                    <p>Envoyer le fichier {selectedFile} ? </p>
                    <button onClick={() => setSelectedFile(null)}>
                        <FaThumbsDown className='va-middle' />{' '}
                        <span className='va-middle'>Non</span>
                    </button>
                    <button onClick={sendSelectedFile}>
                        <span>Oui</span> <FaThumbsUp />
                    </button>
                </div>
            </div>
        );

    return (
        <div className='center'>
            <div className={style.grid}>
                {files.map((f, i) => (
                    <div key={f + '/' + i} onClick={() => setSelectedFile(f)}>
                        <div className={style.option}>
                            <div className={style.circle}>{i + 1}</div>
                        </div>
                        <div>{f}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
