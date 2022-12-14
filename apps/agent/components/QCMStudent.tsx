import { useState, useEffect } from 'react';
import { useSocketContext } from '@utils/global';
import QCMAnswers from './QCMAnswers';

export default function QCMStudent() {
    const [qcm, setQuestion] = useState<{
        questionId: number;
        question: string;
        answers: { counter: number; answer: string }[];
    }>({
        questionId: -1,
        question: '',
        answers: [],
    });

    const [status, setStatus] = useState<number[]>([]);
    const socket = useSocketContext();

    useEffect(() => {
        socket.on('QCMQuestion', ([questionId, question, answers, newQcm]) => {
            setQuestion({ questionId, question, answers });
            if (newQcm) {
                setStatus([-1]);
            }
            if (status.length < questionId + 1) {
                setStatus([...status, -1]);
            }
        });
        socket.on('QCMEvent', (msg) => {
            if (msg === 'end') {
                setStatus([]);
                setQuestion({ questionId: -1, question: '', answers: [] });
            }
        });

        return () => {
            socket.off('QCMQuestion');
            socket.off('QCMEvent');
        };
    });

    return (
        <div className='center'>
            {qcm.questionId !== -1 ? (
                <QCMAnswers
                    questionId={qcm.questionId}
                    question={qcm.question}
                    answers={qcm.answers}
                    status={status}
                    setStatus={(n) =>
                        setStatus(
                            status.map((s, i) => (i === qcm.questionId ? n : s))
                        )
                    }
                />
            ) : (
                <div>
                    <span className='loader'></span>
                    <p>En attente de questions</p>
                </div>
            )}
        </div>
    );
}
