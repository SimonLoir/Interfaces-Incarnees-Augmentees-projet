import { useSocketContext } from '@utils/global';
import { useEffect } from 'react';
interface PollAwaitingProps {
    startPoll: () => void;
    editQuestions: () => void;
    clearAnswers: () => void;
}
export default function PollAwaiting({
    startPoll,
    editQuestions,
    clearAnswers,
}: PollAwaitingProps) {
    const socket = useSocketContext();

    useEffect(() => {
        clearAnswers();
    }, [clearAnswers]);

    useEffect(() => {
        socket.on('thumbs_left_gesture', () => {
            editQuestions();
        });
        socket.on('thumbs_right_gesture', () => {
            startPoll();
        });
        return () => {
            socket.off('thumbs_left_gesture');
            socket.off('thumbs_right_gesture');
        };
    }, [socket]);

    return (
        <div className='center'>
            <div style={{ textAlign: 'center' }}>
                <span className='loader'></span>
                <p>En attente des participants...</p>
                <button onClick={editQuestions} className='button'>
                    Edition des questions
                </button>
                <button onClick={startPoll} className='button'>
                    Lancer le sondage
                </button>
            </div>
        </div>
    );
}
