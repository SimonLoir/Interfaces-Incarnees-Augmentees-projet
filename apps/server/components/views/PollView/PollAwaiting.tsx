import { useSocketContext } from '@utils/global';
import { useEffect } from 'react';
import { BsArrowClockwise, BsArrowCounterclockwise } from 'react-icons/bs';
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
    }, [socket, editQuestions, startPoll]);

    return (
        <div className='center'>
            <div style={{ textAlign: 'center' }}>
                <span className='loader'></span>
                <p>En attente des participants...</p>
                <button onClick={editQuestions} className='button'>
                    <BsArrowCounterclockwise className='va-middle' />{' '}
                    <span className='va-middle'>Edition des questions</span>
                </button>
                <button onClick={startPoll} className='button'>
                    <span className='va-middle'>Lancer le sondage</span>{' '}
                    <BsArrowClockwise className='va-middle' />
                </button>
            </div>
        </div>
    );
}
