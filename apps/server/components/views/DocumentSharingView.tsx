import { useSocketContext } from '@utils/global';

export default function DocumentSharingView() {
    const socket = useSocketContext();
    return (
        <>
            <button onClick={() => socket.emit('document', 'logo.png')}>
                Test envoi image
            </button>
        </>
    );
}
