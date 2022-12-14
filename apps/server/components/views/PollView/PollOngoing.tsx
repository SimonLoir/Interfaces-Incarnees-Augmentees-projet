import { useSocketContext } from '@utils/global';
import { useEffect, useState, useCallback } from 'react';
import { Question } from '.';
import ProgressBar from './ProgressBar';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

interface PollOngoingProps {
    exitPoll: () => void;
    questionList: Question[];
    setQuestionList: (questionList: Question[]) => void;
    showResults: () => void;
}

export default function PollOngoing({
    exitPoll,
    questionList,
    setQuestionList,
    showResults,
}: PollOngoingProps) {
    const socket = useSocketContext();
    const [newPoll, setNewPoll] = useState<boolean>(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const onClickQuit = useCallback(() => {
        setCurrentQuestionIndex(0);
        showResults();
    }, [showResults]);

    useEffect(() => {
        return () => {
            socket.emit('pollEvent', 'end');
        };
    }, []);

    useEffect(() => {
        socket.emit('pollQuestion', [
            currentQuestionIndex,
            questionList[currentQuestionIndex],
            newPoll,
        ]);
        setNewPoll(false);
    }, [socket, currentQuestionIndex, newPoll, questionList]);

    useEffect(() => {
        socket.on('approval', (id) => {
            setQuestionList(
                questionList.map((poll, index) => {
                    if (index === Number(id)) {
                        poll.counter[0]++;
                    }
                    return poll;
                })
            );
        });
        socket.on('refusal', (id) => {
            setQuestionList(
                questionList.map((poll, index) => {
                    if (index === Number(id)) {
                        poll.counter[1]++;
                    }
                    return poll;
                })
            );
        });
        socket.on('thumbs_left_gesture', () => {
            exitPoll();
        });
        socket.on('thumbs_right_gesture', () => {
            if (currentQuestionIndex >= questionList.length - 1) onClickQuit();
            else setCurrentQuestionIndex(currentQuestionIndex + 1);
        });

        return () => {
            socket.off('approval');
            socket.off('refusal');
            socket.off('thumbs_left_gesture');
            socket.off('thumbs_right_gesture');
        };
    }, [
        socket,
        questionList,
        setQuestionList,
        currentQuestionIndex,
        exitPoll,
        onClickQuit,
    ]);

    const currentQuestion = questionList[currentQuestionIndex];
    const total = currentQuestion.counter[0] + currentQuestion.counter[1];
    const [approvals, refusals] = currentQuestion.counter;

    return (
        <div className='center'>
            <div style={{ textAlign: 'center' }}>
                <h2>{currentQuestion.question}</h2>
                {total === 0 ? (
                    <div>
                        <p>
                            <span className='loader'></span>
                        </p>
                        En attente de r??ponses
                    </div>
                ) : (
                    <p>
                        <ProgressBar
                            progress={(approvals / total) * 100}
                            forCount={approvals}
                            against={refusals}
                        />
                    </p>
                )}
                <p>
                    <button onClick={() => exitPoll()} className='button'>
                        <FaThumbsDown className='va-middle thumb-rotate' />{' '}
                        <span className='va-middle'>Quitter</span>
                    </button>
                    {currentQuestionIndex < questionList.length - 1 ? (
                        <button
                            onClick={() => {
                                setCurrentQuestionIndex(
                                    currentQuestionIndex + 1
                                );
                            }}
                            className='button'
                        >
                            <span className='va-middle'>Suivant</span>{' '}
                            <FaThumbsUp className='va-middle thumb-rotate' />
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                onClickQuit();
                            }}
                            className='button'
                        >
                            <span className='va-middle'>R??sultats</span>{' '}
                            <FaThumbsUp className='va-middle thumb-rotate' />
                        </button>
                    )}
                </p>
            </div>
        </div>
    );
}
