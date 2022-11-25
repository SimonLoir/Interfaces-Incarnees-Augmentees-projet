import { useSocketContext } from '@utils/global';
import { QCMQuestion, QCMStates } from '.';
import { useEffect, useState, useCallback } from 'react';
import QCMAnswer from './QCMAnswer';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

type QCMResultsProps = {
    questionList: QCMQuestion[];
    goTo: (state: QCMStates) => void;
};

export default function QCMResults({ questionList, goTo }: QCMResultsProps) {
    const socket = useSocketContext();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const next = useCallback(() => {
        console.log(currentQuestionIndex);
        if (currentQuestionIndex + 1 < questionList.length) {
            console.log('ok');
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }, [currentQuestionIndex, questionList.length, setCurrentQuestionIndex]);

    const previous = useCallback(() => {
        console.log(currentQuestionIndex);
        if (currentQuestionIndex > 0) {
            console.log('ok');
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }, [currentQuestionIndex, setCurrentQuestionIndex]);

    useEffect(() => {
        socket.on('thumbs_left_gesture', () => {
            console.log('thumbs_left_gesture');
            previous();
        });
        socket.on('thumbs_right_gesture', () => {
            console.log('thumbs_right_gesture');
            next();
        });
        socket.on('thumbs_down_gesture', () => {
            goTo('list_questions');
        });

        return () => {
            socket.off('thumbs_left_gesture');
            socket.off('thumbs_right_gesture');
            socket.off('thumbs_down_gesture');
        };
    }, [socket, goTo, next, previous]);

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
                        {currentQuestionIndex > 0 && (
                            <button className='button' onClick={previous}>
                                <FaThumbsDown className='va-middle thumb-rotate' />{' '}
                                <span className='va-middle'>Précédent</span>
                            </button>
                        )}
                        <button
                            className='button'
                            onClick={() => goTo('list_questions')}
                        >
                            <FaThumbsDown className='va-middle' />{' '}
                            <span className='va-middle'>Quitter</span>
                        </button>
                        {currentQuestionIndex !== questionList.length - 1 && (
                            <button className='button' onClick={next}>
                                <span className='va-middle'>Suivant</span>{' '}
                                <FaThumbsUp className='va-middle thumb-rotate' />
                            </button>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
