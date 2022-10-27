/* eslint-disable indent */
import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useSocketContext } from '@utils/global';

export default function PollStudents() {
    const [status, setStatus] = useState<boolean | undefined>();
    const [question, setQuestion] = useState<{ id: string; question: string }>({
        id: '',
        question: '',
    });
    const socket = useSocketContext();
    const [pollConnection, setPollConnection] = useState<boolean>(false);
    const host = process.env.NEXT_PUBLIC_SERVER_HOST || 'localhost';
    const port = process.env.NEXT_PUBLIC_SERVER_PORT || '3001';

    useEffect(() => {
        socket.on('pollConnected', (msg) => {
            setPollConnection(true);
        });
        if (!pollConnection) {
            fetch(`http://${host}:${port}/poll-connect/`);
        }

        socket.on('pollQuestion', ([id, question]) => {
            setQuestion({ id, question });
            setStatus(undefined);
        });
        return () => {
            socket.off('pollQuestion');
            socket.off('pollConnected');
        };
    });

    return (
        <div>
            {question.question ? (
                <div>
                    {question.question}
                    <button
                        style={
                            status === undefined
                                ? {
                                      backgroundColor: 'rgb(175, 48, 51)',
                                      color: 'white',
                                      pointerEvents: 'auto',
                                  }
                                : status === true
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
                            setStatus(true);
                            fetch(
                                `http://${host}:${port}/approval/${question.id}`
                            );
                        }}
                    >
                        Vrai
                    </button>
                    <button
                        style={
                            status === undefined
                                ? {
                                      backgroundColor: 'rgb(175, 48, 51)',
                                      color: 'white',
                                      pointerEvents: 'auto',
                                  }
                                : status === false
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
                            setStatus(false);
                            fetch(
                                `http://${host}:${port}/refusal/${question.id}`
                            );
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
