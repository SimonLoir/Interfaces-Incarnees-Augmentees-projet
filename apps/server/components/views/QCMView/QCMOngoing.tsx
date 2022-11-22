import { useSocketContext } from '@utils/global';
import { useEffect, useMemo, useState } from 'react';
import { QCMQuestion, QCMStates } from '.';
import QCMAnswer from './QCMAnswer';
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

    useEffect(() => {
        return () => {
            socket.emit('QCMEvent', 'end');
        };
    }, []);

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

    const max = currentQuestion.answers.reduce(
        (x, y) => (y.counter > x ? y.counter : x),
        0
    );

    const next = () => {
        if (currentQuestionIndex + 1 < questionList.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            goTo('list_questions');
        }
    };

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
                    Quitter
                </button>
                <button className='button' onClick={next}>
                    Suivant
                </button>
            </p>
        </div>
    );
}
