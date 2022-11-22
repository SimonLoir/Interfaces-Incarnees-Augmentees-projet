import { useSocketContext } from '@utils/global';
import { useEffect, useState } from 'react';
import { Question } from '.';
import ProgressBar from './ProgressBar';

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
            console.log('user approved');

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
            console.log('user refused');
            setQuestionList(
                questionList.map((poll, index) => {
                    if (index === Number(id)) {
                        poll.counter[1]++;
                    }
                    return poll;
                })
            );
        });

        return () => {
            socket.off('approval');
            socket.off('refusal');
        };
    }, [socket, questionList, setQuestionList]);

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
                        En attente de réponses
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
                        Quitter
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
                            Suivant
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setCurrentQuestionIndex(0);
                                socket.emit('pollEvent', 'end');
                                showResults();
                            }}
                            className='button'
                        >
                            Résultats
                        </button>
                    )}
                </p>
            </div>
        </div>
    );
}