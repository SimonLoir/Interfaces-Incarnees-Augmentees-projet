/* eslint-disable indent */
import { useState, useEffect } from 'react';
import { useSocketContext } from '@utils/global';
import { getServerInfo } from 'utils/network';
import style from '@style/poll.module.scss';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

export default function PollStudents() {
    const [status, setStatus] = useState<(boolean | undefined)[]>([]);
    const [question, setQuestion] = useState<{ id: number; question: string }>({
        id: -1,
        question: '',
    });
    const socket = useSocketContext();
    const [pollConnection, setPollConnection] = useState<boolean>(false);
    const { host, port } = getServerInfo();
    function handleGesture(gesture: any) {
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

        socket.on('pollEvent', (msg) => {
            if (msg === 'end') {
                setStatus([]);
                setQuestion({ id: -1, question: '' });
                setPollConnection(false);
            }
        });

        socket.on('pollQuestion', ([id, poll, newPoll]) => {
            const question = poll.question;
            setQuestion({ id, question });
            if (newPoll) {
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
            socket.off('pollEvent');
        };
    }, [socket, status, question, pollConnection]);

    function approval() {
        handleGesture('thumb-position-up');
    }

    function refusal() {
        handleGesture('thumb-position-down');
    }

    if (question.question === '')
        return (
            <div className='center'>
                <div>
                    <span className='loader'></span>
                    <p>En attente de question</p>
                </div>
            </div>
        );

    return (
        <div className='center'>
            <div className={style.main}>
                <h2>{question.question}</h2>
                <button
                    className={
                        status[question.id] === undefined
                            ? style.allowClick
                            : status[question.id] === false
                            ? style.clicked
                            : style.disabled
                    }
                    onClick={refusal}
                >
                    <FaThumbsDown className='va-middle' />{' '}
                    <span className='va-middle'>Faux</span>
                </button>
                <button
                    className={
                        status[question.id] === undefined
                            ? style.allowClick
                            : status[question.id] === true
                            ? style.clicked
                            : style.disabled
                    }
                    onClick={approval}
                >
                    <span className='va-middle'>Vrai</span> <FaThumbsUp />
                </button>
            </div>
        </div>
    );
}
