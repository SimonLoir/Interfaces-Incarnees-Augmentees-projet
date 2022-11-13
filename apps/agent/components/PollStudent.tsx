/* eslint-disable indent */
import { useState, useEffect } from 'react';
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

        socket.on('thumbs_up_gesture', () => {
            handleGesture('thumb-position-up');
        });

        socket.on('thumbs_down_gesture', () => {
            handleGesture('thumb-position-down');
        });

        function handleGesture(gesture: any) {
            console.log(gesture);
            //Concurrency handling for button press + thumbs up/ thumbs down
            setStatus((status) => {
                if (status !== undefined) return status;
                if (gesture === 'thumb-position-up') {
                    fetch(`http://${host}:${port}/approval/${question.id}`);
                    return true;
                } else if (gesture === 'thumb-position-down') {
                    fetch(`http://${host}:${port}/refusal/${question.id}`);
                    return false;
                }
            });
        }

        return () => {
            socket.off('pollQuestion');
            socket.off('pollConnected');
            socket.off('gesture', handleGesture);
            socket.off('thumbs_up_gesture');
            socket.off('thumbs_down_gesture');
        };
    }, [socket]);

    function approval() {
        setStatus(true);
        fetch(`http://${host}:${port}/approval/${question.id}`);
    }

    function refusal() {
        setStatus(false);
        fetch(`http://${host}:${port}/refusal/${question.id}`);
    }

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
                        onClick={approval}
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
                        onClick={refusal}
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
