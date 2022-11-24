import { useSocketContext } from '@utils/global';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { QCMQuestion, QCMStates } from '.';
import QCMAnswer from './QCMAnswer';
import { BsArrowClockwise, BsArrowCounterclockwise } from 'react-icons/bs';
type QCMOngoingProps = {
    questionList: QCMQuestion[];
    setQuestionList: (q: QCMQuestion[]) => void;
    goTo: (state: QCMStates) => void;
};
export default function QCMOngoing({
    questionList,
    setQuestionList,
    goTo,
}: QCMOngoingProps) {
    const socket = useSocketContext();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [newQcm, setNewQcm] = useState<boolean>(true);
    const currentQuestion = useMemo(
        () => questionList[currentQuestionIndex],
        [currentQuestionIndex, questionList]
    );
    const next = useCallback(() => {
        if (currentQuestionIndex + 1 < questionList.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            goTo('results');
        }
    }, [currentQuestionIndex, goTo, questionList.length]);

    useEffect(() => {
        return () => {
            socket.emit('QCMEvent', 'end');
        };
    }, [socket]);

    useEffect(() => {
        socket.emit('QCMQuestion', [
            currentQuestionIndex,
            questionList[currentQuestionIndex].question,
            questionList[currentQuestionIndex].answers,
            newQcm,
        ]);
        setNewQcm(false);
    }, [socket, currentQuestionIndex, newQcm, questionList]);

    useEffect(() => {
        socket.on('answer', ([answerNum, id]) => {
            if (Number(id) === currentQuestionIndex) {
                setQuestionList(
                    questionList.map((qcm, i) => {
                        if (i === Number(id)) {
                            qcm.answers[answerNum].counter++;
                        }
                        return qcm;
                    })
                );
            }
        });

        return () => {
            socket.off('answer');
        };
    }, [socket, currentQuestionIndex, questionList, setQuestionList]);

    useEffect(() => {
        socket.on('thumbs_left_gesture', () => {
            goTo('list_questions');
        });
        socket.on('thumbs_right_gesture', () => {
            next();
        });

        return () => {
            socket.off('thumbs_left_gesture');
            socket.off('thumbs_right_gesture');
        };
    }, [socket, goTo, next]);

    const max = currentQuestion.answers.reduce(
        (x, y) => (y.counter > x ? y.counter : x),
        0
    );

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>{currentQuestion.question}</h2>
            {currentQuestion.answers.map((answer, i) => (
                <QCMAnswer
                    choice={answer.answer}
                    max={max}
                    count={answer.counter}
                    key={`qcm${i}-${currentQuestionIndex}`}
                />
            ))}
            <p>
                <button
                    className='button'
                    onClick={() => goTo('list_questions')}
                >
                    <BsArrowCounterclockwise className='va-middle' />{' '}
                    <span className='va-middle'>Quitter</span>
                </button>
                <button className='button' onClick={next}>
                    <span className='va-middle'>
                        {currentQuestionIndex !== questionList.length - 1
                            ? 'Suivant'
                            : 'Résultats'}
                    </span>{' '}
                    <BsArrowClockwise className='va-middle' />
                </button>
            </p>
        </div>
    );
}
