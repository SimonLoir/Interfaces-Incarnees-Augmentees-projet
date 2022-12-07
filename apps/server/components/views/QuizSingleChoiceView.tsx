/* eslint-disable indent */
import { useEffect, useState } from 'react';
import style from '@style/QuizSingleChoice.module.scss';
import { useSocketContext } from '@utils/global';

type stateType = 'creation' | 'awaiting' | 'ongoing';

export default function QuizSingleChoice() {
    const [questionList, setQuestionList] = useState<
        { question: string; counter: number[] }[]
    >(() => {
        const initPreset = localStorage.getItem('pollPreset');
        if (initPreset) return JSON.parse(initPreset);
        return [];
    });
    const [newPoll, setNewPoll] = useState<boolean>(true);
    // id = index of the question, [number,number] = results (left: approval, right: refusal)
    // to keep historic for teacher

    const [currentState, setCurrentState] = useState<stateType>('creation');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [question, setQuestion] = useState('');
    const socket = useSocketContext();

    function resetCounter(): void {
        setQuestionList(
            questionList.map((poll) => {
                poll.counter = [0, 0];
                return poll;
            })
        );
    }

    useEffect(() => {
        if (currentState !== 'creation') {
            if (currentState === 'ongoing') {
                if (currentQuestionIndex < questionList.length) {
                    socket.emit('pollQuestion', [
                        currentQuestionIndex,
                        questionList[currentQuestionIndex],
                        newPoll,
                    ]);
                    setNewPoll(false);
                }
            }
        }
    }, [currentState, currentQuestionIndex, socket, newPoll, questionList]);

    useEffect(() => {
        localStorage.setItem('pollPreset', JSON.stringify(questionList));
    }, [questionList]);

    useEffect(() => {
        socket.on('approval', (id) => {
            setQuestionList(
                questionList.map((poll, index) => {
                    if (index === Number(id)) {
                        poll.counter[0]++;
                    }
                    return poll;
                })
            );
        });
        socket.on('refusal', (id) => {
            setQuestionList(
                questionList.map((poll, index) => {
                    if (index === Number(id)) {
                        poll.counter[1]++;
                    }
                    return poll;
                })
            );
        });

        return () => {
            socket.off('approval');
            socket.off('refusal');
        };
    }, [socket, questionList]);

    if (currentState === 'awaiting') {
        return (
            <div className={style.mainAwaiting}>
                <p>Waiting for people to connect</p>
                <div>
                    <div>
                        <ul>
                            {questionList.map((poll, i) => {
                                return <li key={i}>{poll.question}</li>;
                            })}
                        </ul>
                    </div>
                    <div>
                        <button onClick={() => setCurrentState('creation')}>
                            back
                        </button>
                        <button
                            onClick={() => {
                                resetCounter();
                                setNewPoll(true);
                                setCurrentState('ongoing');
                            }}
                        >
                            start poll
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (currentState === 'ongoing') {
        return (
            <div className={style.mainOngoing}>
                {!(currentQuestionIndex >= questionList.length) && (
                    <div className={style.question}>
                        <p>{questionList[currentQuestionIndex].question}</p>
                    </div>
                )}
                {currentQuestionIndex >= questionList.length && (
                    <div className={style.end}>Current poll ended</div>
                )}
                <div className={style.menu}>
                    <div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Question</th>
                                        <th>Réponses favorables</th>
                                        <th>Réponses défavorables</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questionList.map((poll, i) => (
                                        <tr
                                            key={'poll ' + i}
                                            style={{
                                                backgroundColor:
                                                    currentQuestionIndex === i
                                                        ? 'lightgrey'
                                                        : '',
                                            }}
                                        >
                                            <td>
                                                #{i + 1} {poll.question}
                                            </td>
                                            <td>{poll.counter[0]}</td>
                                            <td>{poll.counter[1]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setCurrentState('creation');
                                    resetCounter();
                                    setCurrentQuestionIndex(0);
                                    socket.emit('pollEvent', 'end');
                                }}
                            >
                                exit
                            </button>
                            <div>
                                {!(
                                    currentQuestionIndex >= questionList.length
                                ) &&
                                    currentQuestionIndex > 0 && (
                                        <button
                                            onClick={() => {
                                                setCurrentQuestionIndex(
                                                    currentQuestionIndex - 1
                                                );
                                            }}
                                        >
                                            back
                                        </button>
                                    )}
                                {!(
                                    currentQuestionIndex >= questionList.length
                                ) && (
                                    <button
                                        onClick={() => {
                                            setCurrentQuestionIndex(
                                                currentQuestionIndex + 1
                                            );
                                        }}
                                    >
                                        next
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (currentState === 'creation') {
        return (
            <div className={style.main}>
                <form
                    name='questions'
                    onSubmit={(e) => {
                        e.preventDefault();
                        const inputs: {
                            question: string;
                            counter: number[];
                        }[] = [];

                        inputs.push({
                            question,
                            counter: [0, 0],
                        });

                        setQuestionList((list) => [...list, ...inputs]);
                    }}
                >
                    <input
                        key='input'
                        required={true}
                        name='question_input'
                        type='text'
                        placeholder='question'
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    ></input>
                    <button type='submit'>add question</button>
                </form>
                <div>
                    {questionList.length > 0 && (
                        <ul>
                            {questionList.map((poll, i) => {
                                return <li key={i}>{poll.question}</li>;
                            })}
                        </ul>
                    )}

                    {questionList.length !== 0 && (
                        <div>
                            <button
                                type='button'
                                onClick={() => {
                                    setQuestionList([]);
                                }}
                            >
                                reset list
                            </button>
                            <button
                                type='button'
                                onClick={() => setCurrentState('awaiting')}
                            >
                                Start poll
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
