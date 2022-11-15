/* eslint-disable indent */
import { useState, useEffect } from 'react';
import { useSocketContext } from '@utils/global';

export default function PollStudents() {
    const [status, setStatus] = useState<(boolean | undefined)[]>([]);
    const [question, setQuestion] = useState<{ id: number; question: string }>({
        id: -1,
        question: '',
    });
    const socket = useSocketContext();
    const [pollConnection, setPollConnection] = useState<boolean>(false);
    const host = process.env.NEXT_PUBLIC_SERVER_HOST || 'localhost';
    const port = process.env.NEXT_PUBLIC_SERVER_PORT || '3001';

    function handleGesture(gesture: any) {
        console.log(gesture);
        //Concurrency handling for button press + thumbs up/ thumbs down
        setStatus(
            status.map((s, i) => {
                if (i === question.id) {
                    if (s !== undefined) return s;
                    if (gesture === 'thumb-position-up') {
                        fetch(
                            `http://${host}:${port}/${question.id}/approval/`
                        );
                        return true;
                    } else if (gesture === 'thumb-position-down') {
                        fetch(`http://${host}:${port}/${question.id}/refusal`);
                        return false;
                    }
                }
                return s;
            })
        );
    }

    useEffect(() => {
        socket.on('pollConnected', (msg) => {
            setPollConnection(true);
        });
        if (!pollConnection) {
            fetch(`http://${host}:${port}/poll-connect/`);
        }

        socket.on('pollQuestion', ([id, poll, newPoll]) => {
            const question = poll.question;
            setQuestion({ id, question });
            if (newPoll) {
                console.log('new poll');
                setStatus([undefined]);
            }

            if (status.length < id + 1) {
                setStatus([...status, undefined]);
            }
        });

        socket.on('thumbs_up_gesture', () => {
            handleGesture('thumb-position-up');
        });

        socket.on('thumbs_down_gesture', () => {
            handleGesture('thumb-position-down');
        });

        return () => {
            socket.off('pollQuestion');
            socket.off('pollConnected');
            socket.off('thumbs_up_gesture');
            socket.off('thumbs_down_gesture');
        };
    }, [socket, status, question, pollConnection]);

    function approval() {
        handleGesture('thumb-position-up');
    }

    function refusal() {
        handleGesture('thumb-position-down');
    }

    return (
        <div>
            {question.question ? (
                <div>
                    {question.question}
                    <button
                        style={
                            status[question.id] === undefined
                                ? {
                                      backgroundColor: 'rgb(175, 48, 51)',
                                      color: 'white',
                                      pointerEvents: 'auto',
                                  }
                                : status[question.id] === true
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
                            status[question.id] === undefined
                                ? {
                                      backgroundColor: 'rgb(175, 48, 51)',
                                      color: 'white',
                                      pointerEvents: 'auto',
                                  }
                                : status[question.id] === false
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
