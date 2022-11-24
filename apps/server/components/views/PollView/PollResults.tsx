import { useSocketContext } from '@utils/global';
import { useEffect } from 'react';
import { Question } from '.';
import ProgressBar from './ProgressBar';
import { FaThumbsDown } from 'react-icons/fa';

type PollResultsProps = {
    questionList: Question[];
    exitPoll: () => void;
};
export default function PollResults({
    questionList,
    exitPoll,
}: PollResultsProps) {
    const socket = useSocketContext();

    useEffect(() => {
        socket.on('thumbs_left_gesture', () => {
            exitPoll();
        });

        return () => {
            socket.off('thumbs_left_gesture');
        };
    }, [socket, exitPoll]);

    return (
        <div className='center'>
            <div style={{ textAlign: 'center' }}>
                <h2>Résultats</h2>
                <div
                    style={{
                        maxHeight: '50',
                        overflow: 'auto',
                        marginBottom: '15px',
                    }}
                >
                    {questionList.map((question, index) => (
                        <div key={index}>
                            <p style={{ margin: '5px' }}>{question.question}</p>
                            <ProgressBar
                                progress={
                                    question.counter[0] === question.counter[1]
                                        ? 50
                                        : (question.counter[0] /
                                              (question.counter[0] +
                                                  question.counter[1])) *
                                          100
                                }
                                forCount={question.counter[0]}
                                against={question.counter[1]}
                            />
                        </div>
                    ))}
                </div>
                <button onClick={exitPoll} className='button'>
                    <FaThumbsDown className='va-middle thumb-rotate' />{' '}
                    <span className='va-middle'>Quitter</span>
                </button>
            </div>
        </div>
    );
}
