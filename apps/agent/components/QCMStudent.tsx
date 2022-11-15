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

    const [status, setStatus] = useState<number>(0);
    const socket = useSocketContext();

    useEffect(() => {
        socket.on('QCMQuestion', ([questionId, question, answers]) => {
            console.log('received QCM question');
            setQuestion({ questionId, question, answers });
            setStatus(0);
        });
        return () => {
            socket.off('QCMQuestion');
        };
    });

    return (
        <div>
            {qcm.questionId !== -1 ? (
                <QCMAnswers
                    questionId={qcm.questionId}
                    question={qcm.question}
                    answers={qcm.answers}
                    status={status}
                    setStatus={(n) => setStatus(n)}
                />
            ) : (
                'Pas de question'
            )}
        </div>
    );
}
