import { QCMQuestion, QCMStates } from '.';
import style from '@style/QCMQuestionList.module.scss';
import {
    BsFillArrowLeftCircleFill,
    BsFillArrowRightCircleFill,
} from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { useSocketContext } from '@utils/global';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

type ListQuestionsProps = {
    goTo: (state: QCMStates) => void;
    questionList: QCMQuestion[];
    clearQcm: () => void;
};
export default function QCMListQuestions({
    goTo,
    questionList,
    clearQcm,
}: ListQuestionsProps) {
    const socket = useSocketContext();
    const [questionIndex, setQuestionIndex] = useState(0);
    const addQuestionButton = (
        <button onClick={() => goTo('edit')} className={'button'}>
            <span className='va-middle'>Ajouter une question</span>{' '}
            <FaThumbsUp className='va-middle' />
        </button>
    );

    useEffect(() => {
        socket.on('thumbs_left_gesture', () => {
            clearQcm();
        });
        socket.on('thumbs_right_gesture', () => {
            goTo('awaiting');
        });
        socket.on('thumbs_up_gesture', () => {
            goTo('edit');
        });

        return () => {
            socket.off('thumbs_left_gesture');
            socket.off('thumbs_right_gesture');
            socket.off('thumbs_up_gesture');
        };
    }, [socket, clearQcm, goTo]);

    if (questionList.length === 0)
        return (
            <div style={{ textAlign: 'center' }}>
                <p>Ajoutez une question pour lancer le questionnaire.</p>
                {addQuestionButton}
            </div>
        );

    const question = questionList[questionIndex];
    const previousQuestion =
        questionIndex > 0 ? (
            <span
                onClick={() => setQuestionIndex((i) => i - 1)}
                className={style.arrow}
            >
                <BsFillArrowLeftCircleFill />
            </span>
        ) : null;
    const nextQuestion =
        questionIndex < questionList.length - 1 ? (
            <span
                onClick={() => setQuestionIndex((i) => i + 1)}
                className={style.arrow}
            >
                <BsFillArrowRightCircleFill />
            </span>
        ) : null;

    return (
        <div style={{ textAlign: 'center' }}>
            <div className={style.question}>
                {previousQuestion}
                <h3>{question.question}</h3>
                {nextQuestion}
                <div>
                    {question.answers.map((answer, index) => (
                        <span key={index} className={style.choice}>
                            {answer.answer}
                        </span>
                    ))}
                </div>
            </div>
            <button onClick={clearQcm} className='button'>
                <FaThumbsDown className='va-middle thumb-rotate' />{' '}
                <span className='va-middle'>Réinitialiser</span>
            </button>
            {addQuestionButton}
            <button onClick={() => goTo('awaiting')} className='button'>
                <span className='va-middle'>Lancer le questionnaire</span>{' '}
                <FaThumbsUp className='va-middle thumb-rotate' />
            </button>
        </div>
    );
}
