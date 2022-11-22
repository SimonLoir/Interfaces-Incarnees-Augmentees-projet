import { useEffect } from 'react';
import { QCMStates } from '.';

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

    return (
        <div className='center'>
            <div style={{ textAlign: 'center' }}>
                <span className='loader'></span>
                <p>En attente des participants...</p>
                <button
                    onClick={() => goTo('list_questions')}
                    className='button'
                >
                    Edition des questions
                </button>
                <button onClick={() => goTo('ongoing')} className='button'>
                    Lancer le sondage
                </button>
            </div>
        </div>
    );
}
