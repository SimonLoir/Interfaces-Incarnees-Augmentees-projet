/* eslint-disable indent */
import { ReactElement, useEffect, useState } from 'react';
import style from '@style/QuizSingleChoice.module.scss';
import { useSocketContext } from '@utils/global';

type stateType = 'creation' | 'awaiting' | 'ongoing';

export default function QuizSingleChoice() {
    const [inputValue, setInputValue] = useState<string>('');
    const [questionList, setQuestionList] = useState<string[]>([]);
    // id = index of the question, [number,number] = results (left: approval, right: refusal)
    // to keep historic for teacher
    const [answerCounter, setAnswerCounter] = useState<{
        [id: string]: [number, number];
    }>({ 0: [0, 0] });
    const [currentState, setCurrentState] = useState<stateType>('creation');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const socket = useSocketContext();

    useEffect(() => {
        if (currentState !== 'creation') {
            socket.on('new-poll-participation', (id) => {
                console.log('new poll participant');
            });
            if (currentState === 'ongoing') {
                if (currentQuestionIndex < questionList.length) {
                    socket.emit('pollQuestion', [
                        currentQuestionIndex,
                        questionList[currentQuestionIndex],
                    ]);
                    console.log('emitted question');
                }

                socket.on('approval', (id) => {
                    console.log('user approved');
                    const answers = { ...answerCounter };
                    answers[id][0] = answers[id][0] + 1;
                    setAnswerCounter(answers);
                });
                socket.on('refusal', (id) => {
                    console.log('user refused');
                    const answers = { ...answerCounter };
                    answers[id][1] = answers[id][1] + 1;
                    setAnswerCounter(answers);
                });
            }
        }
        return () => {
            socket.off('new-poll-participation');
            socket.off('approval');
            socket.off('refusal');
        };
    }, [currentQuestionIndex, currentState, questionList, socket]);

    if (currentState === 'awaiting') {
        return (
            <div className={style.mainAwaiting}>
                <p>Waiting for people to connect</p>
                <div>
                    <ul>
                        {questionList.map((question, i) => {
                            return <li key={i}>{question}</li>;
                        })}
                    </ul>
                    <button onClick={() => setCurrentState('creation')}>
                        back
                    </button>
                    <button onClick={() => setCurrentState('ongoing')}>
                        start poll
                    </button>
                </div>
            </div>
        );
    }

    if (currentState === 'ongoing') {
        return (
            <div className={style.mainOngoing}>
                {!(currentQuestionIndex >= questionList.length) && (
                    <div className={style.question}>
                        <p>{questionList[currentQuestionIndex]}</p>
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
                                    {questionList.map((question, i) => (
                                        <tr
                                            key={i}
                                            style={{
                                                backgroundColor:
                                                    currentQuestionIndex === i
                                                        ? 'rgba(255,255,0, 0.5)'
                                                        : '',
                                            }}
                                        >
                                            <th>
                                                #{i + 1} {question}
                                            </th>
                                            <th>
                                                {answerCounter[i]
                                                    ? answerCounter[i][0]
                                                    : 0}
                                            </th>
                                            <th>
                                                {answerCounter[i]
                                                    ? answerCounter[i][1]
                                                    : 0}
                                            </th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setCurrentState('creation');
                                    setCurrentQuestionIndex(0);
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
                                                const i =
                                                    currentQuestionIndex - 1;
                                                setAnswerCounter((answers) => {
                                                    answers[i] = [0, 0];
                                                    return { ...answers };
                                                });
                                                setCurrentQuestionIndex(
                                                    (i) => i - 1
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
                                            const i = currentQuestionIndex + 1;
                                            //Resets the given answers of the students to allow them to re-answer to that question
                                            setAnswerCounter((answers) => {
                                                answers[i + 1] = [0, 0];
                                                return { ...answers };
                                            });
                                            setCurrentQuestionIndex(
                                                (i) => i + 1
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
                        setAnswerCounter((answers) => {
                            answers[questionList.length + 1] = [0, 0];
                            return { ...answers };
                        });
                        setQuestionList((list) => [...list, inputValue]);
                        setInputValue('');
                    }}
                >
                    <input
                        required={true}
                        name='question_input'
                        type='text'
                        placeholder='question'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    ></input>
                    <button type='submit'>add question</button>
                </form>
                <div>
                    {questionList.length > 0 && (
                        <ul>
                            {questionList.map((question, i) => {
                                return <li key={i}>{question}</li>;
                            })}
                        </ul>
                    )}

                    {questionList.length !== 0 && (
                        <button
                            type='button'
                            onClick={() => setCurrentState('awaiting')}
                        >
                            Start poll
                        </button>
                    )}
                </div>
            </div>
        );
    }
}
