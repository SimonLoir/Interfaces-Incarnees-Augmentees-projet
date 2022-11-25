import { useSocketContext } from '@utils/global';
import { useEffect } from 'react';
import { QCMStates } from '.';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

type QCMAwaitingUsersProps = {
    goTo: (state: QCMStates) => void;
    resetAnswers: () => void;
};
export default function QCMAwaitingUsers({
    goTo,
    resetAnswers,
}: QCMAwaitingUsersProps) {
    useEffect(() => {
        resetAnswers();
    }, [resetAnswers]);

    const socket = useSocketContext();

    useEffect(() => {
        socket.on('thumbs_left_gesture', () => {
            goTo('list_questions');
        });

        socket.on('thumbs_right_gesture', () => {
            goTo('ongoing');
        });

        return () => {
            socket.off('thumbs_left_gesture');
            socket.off('thumbs_right_gesture');
        };
    }, [socket, goTo]);

    return (
        <div className='center'>
            <div style={{ textAlign: 'center' }}>
                <span className='loader'></span>
                <p>En attente des participants...</p>
                <button
                    onClick={() => goTo('list_questions')}
                    className='button'
                >
                    <FaThumbsDown className='va-middle thumb-rotate' />{' '}
                    <span className='va-middle'> Edition des questions</span>
                </button>
                <button onClick={() => goTo('ongoing')} className='button'>
                    <span className='va-middle'>Lancer le questionnaire</span>{' '}
                    <FaThumbsUp className='va-middle thumb-rotate' />
                </button>
            </div>
        </div>
    );
}
