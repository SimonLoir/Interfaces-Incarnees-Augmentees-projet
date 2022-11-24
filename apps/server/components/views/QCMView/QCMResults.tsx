import { useSocketContext } from '@utils/global';
import { BackSide } from 'three';
import { QCMQuestion, QCMStates } from '.';
import { useEffect, useState, useCallback } from 'react';
import QCMAnswer from './QCMAnswer';
import { BsArrowClockwise, BsArrowCounterclockwise } from 'react-icons/bs';

type QCMResultsProps = {
    questionList: QCMQuestion[];
    goTo: (state: QCMStates) => void;
};

export default function QCMResults({ questionList, goTo }: QCMResultsProps) {
    const socket = useSocketContext();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const next = useCallback(() => {
        if (currentQuestionIndex + 1 < questionList.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            goTo('list_questions');
        }
    }, [currentQuestionIndex, goTo, questionList.length]);
    useEffect(() => {
        socket.on('thumbs_left_gesture', () => {});
        socket.on('thumbs_right_gesture', () => {});
        socket.on('thumbs_down_gesture', () => {});

        return () => {
            socket.off('thumbs_left_gesture');
            socket.off('thumbs_right_gesture');
            socket.off('thumbs_down_gesture');
        };
    }, [socket]);

    const max = questionList[currentQuestionIndex].answers.reduce(
        (x, y) => (y.counter > x ? y.counter : x),
        0
    );
    return (
        <div className='center'>
            <div style={{ textAlign: 'center' }}>
                <h2>Résultats</h2>
                <div
                    style={{
                        maxHeight: '50',
                        overflow: 'auto',
                        marginBottom: '15px',
                    }}
                >
                    <h3 style={{ margin: '5px' }}>
                        {questionList[currentQuestionIndex].question}
                    </h3>
                    <div key={currentQuestionIndex}>
                        {questionList[currentQuestionIndex].answers.map(
                            (answer, i) => (
                                <QCMAnswer
                                    choice={answer.answer}
                                    max={max}
                                    count={answer.counter}
                                    key={`qcm${i}-${currentQuestionIndex}`}
                                />
                            )
                        )}
                    </div>
                    <p>
                        <button
                            className='button'
                            onClick={() => goTo('list_questions')}
                        >
                            <BsArrowCounterclockwise className='va-middle' />{' '}
                            <span className='va-middle'>Quitter</span>
                        </button>
                        {currentQuestionIndex !== questionList.length - 1 && (
                            <button className='button' onClick={next}>
                                <span className='va-middle'>Suivant</span>{' '}
                                <BsArrowClockwise className='va-middle' />
                            </button>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
