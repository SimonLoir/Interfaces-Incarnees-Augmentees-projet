import { useSocketContext } from '@utils/global';
import { useEffect, useState } from 'react';

export default function QCMAnswers({
    questionId,
    question,
    answers,
    status,
    setStatus,
}: {
    questionId: number;
    question: string;
    answers: { counter: number; answer: string }[];
    status: number[];
    setStatus: (n: number) => void;
}) {
    const socket = useSocketContext();

    const host = process.env.NEXT_PUBLIC_SERVER_HOST || 'localhost';
    const port = process.env.NEXT_PUBLIC_SERVER_PORT || '3001';

    function handleGesture(answerNum: number) {
        //Concurrency handling

        if (status[questionId] !== -1) return;
        setStatus(answerNum);
        fetch(`http://${host}:${port}/answer/${questionId}/${answerNum}`);
    }

    useEffect(() => {
        socket.on('extended_fingers_gesture', (id) => {
            handleGesture(id);
        });
        return () => {
            socket.off('extended_fingers_gesture');
        };
    });

    return (
        <div>
            <h1>{question}</h1>

            {answers.map(
                (answer, index) => (
                    console.log(answer),
                    (
                        <button
                            key={answer.answer}
                            style={
                                status[questionId] === -1
                                    ? {
                                          backgroundColor: 'rgb(175, 48, 51)',
                                          color: 'white',
                                          pointerEvents: 'auto',
                                      }
                                    : status[questionId] === index
                                    ? {
                                          backgroundColor: 'rgb(175, 48, 51)',
                                          color: 'goldenrod',
                                          pointerEvents: 'none',
                                      }
                                    : {
                                          backgroundColor: 'gray',
                                          color: 'white',
                                          pointerEvents: 'none',
                                      }
                            }
                            onClick={() => {
                                handleGesture(index);
                            }}
                        >
                            {answer.answer}
                        </button>
                    )
                )
            )}
        </div>
    );
}
