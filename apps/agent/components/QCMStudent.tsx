import { useState, useEffect } from 'react';
import { useSocketContext } from '@utils/global';
import QCMAnswers from './QCMAnswers';

export default function QCMStudent() {
    const [qcm, setQuestion] = useState<{
        questionId: number;
        question: string;
        answers: string[];
    }>({
        questionId: -1,
        question: '',
        answers: [],
    });
    const socket = useSocketContext();

    useEffect(() => {
        socket.on('QCMQuestion', ([questionId, question, answers]) => {
            console.log('received QCM question');
            setQuestion({ questionId, question, answers });
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
                />
            ) : (
                'Pas de question'
            )}
        </div>
    );
}
