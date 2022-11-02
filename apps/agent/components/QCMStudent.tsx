import { useState, useEffect } from 'react';
import { useSocketContext } from '@utils/global';

export default function QCMStudent() {
    const [status, setStatus] = useState<number>(0);
    const [question, setQuestion] = useState<{ id: string; question: string }>({
        id: '',
        question: '',
    });
    const socket = useSocketContext();
    const host = process.env.NEXT_PUBLIC_SERVER_HOST || 'localhost';
    const port = process.env.NEXT_PUBLIC_SERVER_PORT || '3001';

    useEffect(() => {
        function handleGesture(gesture: any) {
            //Concurrency handling
            if (status !== 0) return;

            if (gesture.name === 'one-extended-fingers') {
                setStatus(1);
                fetch(`http://${host}:${port}/answer/1/${question.id}`);
            }
            if (gesture.name === 'two-extended-fingers') {
                setStatus(2);
                fetch(`http://${host}:${port}/answer/2/${question.id}`);
            }
            if (gesture.name === 'three-extended-fingers') {
                setStatus(3);
                fetch(`http://${host}:${port}/answer/3/${question.id}`);
            }
            if (gesture.name === 'four-extended-fingers') {
                setStatus(4);
                fetch(`http://${host}:${port}/answer/4/${question.id}`);
            }
            if (gesture.name === 'five-extended-fingers') {
                setStatus(5);
                fetch(`http://${host}:${port}/answer/5/${question.id}`);
            }
        }
        socket.on('gesture', handleGesture);
        socket.on('QCMQuestion', ([id, question]) => {
            console.log('received QCM question');
            setQuestion({ id, question });
            setStatus(0);
        });
        return () => {
            socket.off('QCMQuestion');
            socket.off('gesture', handleGesture);
        };
    });

    return (
        <div>
            {question.question ? (
                <div>
                    {question.question[0]}
                    <button
                        style={
                            status === 0
                                ? {
                                      backgroundColor: 'rgb(175, 48, 51)',
                                      color: 'white',
                                      pointerEvents: 'auto',
                                  }
                                : status === 1
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
                            setStatus(1);
                            fetch(
                                `http://${host}:${port}/answer/1/${question.id}`
                            );
                        }}
                    >
                        {question.question[1]}
                    </button>
                    <button
                        style={
                            status === 0
                                ? {
                                      backgroundColor: 'rgb(175, 48, 51)',
                                      color: 'white',
                                      pointerEvents: 'auto',
                                  }
                                : status === 2
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
                            setStatus(2);
                            fetch(
                                `http://${host}:${port}/answer/2/${question.id}`
                            );
                        }}
                    >
                        {question.question[2]}
                    </button>
                    <button
                        style={
                            status === 0
                                ? {
                                      backgroundColor: 'rgb(175, 48, 51)',
                                      color: 'white',
                                      pointerEvents: 'auto',
                                  }
                                : status === 3
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
                            setStatus(3);
                            fetch(
                                `http://${host}:${port}/answer/3/${question.id}`
                            );
                        }}
                    >
                        {question.question[3]}
                    </button>
                    <button
                        style={
                            status === 0
                                ? {
                                      backgroundColor: 'rgb(175, 48, 51)',
                                      color: 'white',
                                      pointerEvents: 'auto',
                                  }
                                : status === 4
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
                            setStatus(4);
                            fetch(
                                `http://${host}:${port}/answer/4/${question.id}`
                            );
                        }}
                    >
                        {question.question[4]}
                    </button>
                    <button
                        style={
                            status === 0
                                ? {
                                      backgroundColor: 'rgb(175, 48, 51)',
                                      color: 'white',
                                      pointerEvents: 'auto',
                                  }
                                : status === 5
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
                            setStatus(5);
                            fetch(
                                `http://${host}:${port}/answer/5/${question.id}`
                            );
                        }}
                    >
                        {question.question[5]}
                    </button>
                </div>
            ) : (
                'Pas de question'
            )}
        </div>
    );
}
