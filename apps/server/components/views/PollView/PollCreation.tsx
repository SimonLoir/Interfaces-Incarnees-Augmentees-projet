import { useCallback, useEffect, useState } from 'react';
import { Question } from '.';
import style from '@style/PollCreation.module.scss';
import { useSocketContext } from '@utils/global';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

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
    const socket = useSocketContext();

    const addQuestionAndHideModal = useCallback(() => {
        if (question.trim() === '') return;
        addQuestion(question);
        setQuestion('');
        setShowModal(false);
    }, [question, addQuestion]);

    useEffect(() => {
        socket.on('thumbs_up_gesture', () => {
            addQuestionAndHideModal();
        });
        socket.on('thumbs_down_gesture', () => {
            setShowModal(false);
        });
        socket.on('thumbs_left_gesture', () => {
            clearQuestions();
        });
        socket.on('thumbs_right_gesture', () => {
            startPoll();
        });

        return () => {
            socket.off('thumbs_up_gesture');
            socket.off('thumbs_down_gesture');
            socket.off('thumbs_left_gesture');
            socket.off('thumbs_right_gesture');
        };
    }, [socket, clearQuestions, startPoll, addQuestionAndHideModal]);

    if (showAddQuestion)
        return (
            <div className='center'>
                <div style={{ textAlign: 'center' }}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            addQuestionAndHideModal();
                        }}
                    >
                        <input
                            type='text'
                            placeholder='Votre question'
                            className={style.input}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <button className={style.add}>Valider</button>
                    </form>

                    <p>
                        <button
                            className='button'
                            onClick={() => setShowModal(false)}
                        >
                            <span className='va-middle'>Annuler</span>{' '}
                            <FaThumbsDown className='va-middle' />
                        </button>
                    </p>
                </div>
            </div>
        );

    const addQuestionButton = (
        <button className='button' onClick={() => setShowModal(true)}>
            <span className='va-middle'>Ajouter une question</span>{' '}
            <FaThumbsUp className='va-middle' />
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
                                    <FaThumbsDown className='va-middle thumb-rotate' />{' '}
                                    <span className='va-middle'>
                                        R??initialiser
                                    </span>
                                </button>

                                {addQuestionButton}

                                <button onClick={startPoll} className='button'>
                                    <span className='va-middle'>
                                        Lancer le sondage
                                    </span>{' '}
                                    <FaThumbsUp className='va-middle thumb-rotate' />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
