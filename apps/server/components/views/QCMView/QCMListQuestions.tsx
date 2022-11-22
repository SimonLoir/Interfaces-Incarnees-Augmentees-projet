import { QCMQuestion, QCMStates } from '.';
import style from '@style/QCMQuestionList.module.scss';
import {
    BsFillArrowLeftCircleFill,
    BsFillArrowRightCircleFill,
} from 'react-icons/bs';
import { useState } from 'react';

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
    const [questionIndex, setQuestionIndex] = useState(0);
    const addQuestionButton = (
        <button onClick={() => goTo('edit')} className={'button'}>
            Ajouter une question
        </button>
    );
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
                Réinitialiser
            </button>
            {addQuestionButton}
            <button onClick={() => goTo('awaiting')} className='button'>
                Lancer le questionnaire
            </button>
        </div>
    );
}
