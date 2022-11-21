import { useState } from 'react';
import { Question } from '.';
import style from '@style/PollCreation.module.scss';

interface PollCreationProps {
    startPoll: () => void;
    questionList: Question[];
    addQuestion: (question: string) => void;
    clearQuestions: () => void;
}
export default function PollCreation({
    startPoll,
    questionList,
    addQuestion,
    clearQuestions,
}: PollCreationProps) {
    const [showAddQuestion, setShowModal] = useState(false);
    const [question, setQuestion] = useState('');

    if (showAddQuestion)
        return (
            <div className='center'>
                <div style={{ textAlign: 'center' }}>
                    <input
                        type='text'
                        placeholder='Votre question'
                        className={style.input}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <button
                        className={style.add}
                        onClick={() => {
                            if (question.trim() === '') return;
                            addQuestion(question);
                            setQuestion('');
                            setShowModal(false);
                        }}
                    >
                        Valider
                    </button>

                    <p>
                        <button
                            className='button'
                            onClick={() => setShowModal(false)}
                        >
                            Annuler
                        </button>
                    </p>
                </div>
            </div>
        );

    const addQuestionButton = (
        <button className='button' onClick={() => setShowModal(true)}>
            Ajouter une question
        </button>
    );

    return (
        <>
            <div className='center'>
                <div style={{ textAlign: 'center' }}>
                    <div>
                        {questionList.length > 0 && (
                            <>
                                <table className={style.table}>
                                    <thead></thead>
                                    <tbody>
                                        {questionList.map((poll, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <span
                                                            className={
                                                                style.ball
                                                            }
                                                        >
                                                            {i + 1}
                                                        </span>
                                                    </td>
                                                    <td>{poll.question}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {questionList.length === 0 ? (
                            <>
                                <p>
                                    Ajoutez une question pour lancer le sondage
                                </p>
                                {addQuestionButton}
                            </>
                        ) : (
                            <>
                                <button
                                    type='button'
                                    onClick={() => {
                                        clearQuestions();
                                    }}
                                    className='button'
                                >
                                    Réinitialiser
                                </button>

                                {addQuestionButton}

                                <button onClick={startPoll} className='button'>
                                    Lancer le sondage
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
