import { useSocketContext } from '@utils/global';
import { useEffect, useState } from 'react';
import { getServerInfo } from 'utils/network';
import style from '@style/qcm.module.scss';

const { host, port } = getServerInfo();
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

    function handleGesture(answerNum: number) {
        //Concurrency handling

        if (status[questionId] !== -1) return;
        setStatus(answerNum);
        fetch(`http://${host}:${port}/answer/${questionId}/${answerNum}`);
    }

    useEffect(() => {
        socket.on('extended_fingers_gesture', (id) => {
            if (answers.length > id) handleGesture(id);
        });
        return () => {
            socket.off('extended_fingers_gesture');
        };
    });

    return (
        <div className={style.main}>
            <h2>{question}</h2>

            {answers.map(
                (answer, index) => (
                    console.log(answer),
                    (
                        <div>
                            <h2>{index + 1}</h2>
                            <button
                                key={answer.answer}
                                className={
                                    status[questionId] === -1
                                        ? style.allowClick
                                        : status[questionId] === index
                                        ? style.clicked
                                        : style.disabled
                                }
                                onClick={() => {
                                    handleGesture(index);
                                }}
                            >
                                {answer.answer}
                            </button>
                        </div>
                    )
                )
            )}
        </div>
    );
}
