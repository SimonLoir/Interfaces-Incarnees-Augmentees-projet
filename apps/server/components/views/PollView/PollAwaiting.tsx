interface PollAwaitingProps {
    startPoll: () => void;
    editQuestions: () => void;
}
export default function PollAwaiting({
    startPoll,
    editQuestions,
}: PollAwaitingProps) {
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
