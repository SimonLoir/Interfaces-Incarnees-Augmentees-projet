import { useSocketContext } from '@utils/global';
import { useState, useEffect } from 'react';

export default function PollStudents() {
    const [status, setStatus] = useState<boolean | undefined>();
    const [question, setQuestion] = useState<string>();
    const socket = useSocketContext();

    //Bi-directionnal channel with teacher (to send a student's answer to a question)
    useEffect(() => {
        if (socket && status !== undefined) {
            socket.emit('poll_answer', { question, answer: status });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, socket]);

    //Bi-directionnal channel with teacher (to recieve questions from the teacher)
    useEffect(() => {
        if (socket) {
            socket.on('poll_set_question', ({ question }) => {
                setQuestion(question);
            });
            return () => {
                socket.off('poll_set_question');
            };
        }
    }, [socket]);

    return (
        <div>
            {question ? (
                <div>
                    {question}
                    <button
                        style={{
                            backgroundColor: status === true ? 'green' : 'gray',
                        }}
                        onClick={() => {
                            setStatus(true);
                        }}
                    >
                        Vrai
                    </button>
                    <button
                        style={{
                            backgroundColor: status === false ? 'red' : 'gray',
                        }}
                        onClick={() => {
                            setStatus(true);
                        }}
                    >
                        Faux
                    </button>
                </div>
            ) : (
                'Pas de question'
            )}
        </div>
    );
}
