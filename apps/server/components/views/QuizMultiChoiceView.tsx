import { useEffect, useRef, useState } from 'react';
import style from '@style/QuizMultiChoice.module.scss';
import { useSocketContext } from '@utils/global';

import DisplayQuestions from 'components/DisplayQuestions';

type stateType = 'creation' | 'awaiting' | 'ongoing';

function updateInputs(list: string[], value: string, index: number) {
    list[index] = value;
    return list;
}

let maxAnswersNum = 5;

export default function QuizMultiChoice() {
    const [questionList, setQuestionList] = useState<
        {
            question: string;
            answers: { counter: number; answer: string }[];
        }[]
    >(() => {
        const initPreset = localStorage.getItem('qcmPreset');
        if (initPreset) return JSON.parse(initPreset);
        return [];
    });
    const [currentState, setCurrentState] = useState<stateType>('creation');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [newQcm, setNewQcm] = useState<boolean>(true);
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);

    const socket = useSocketContext();

    function resetCounter() {
        setQuestionList(
            questionList.map((qcm) => {
                for (const answer of qcm.answers) {
                    answer.counter = 0;
                }

                return qcm;
            })
        );
    }

    useEffect(() => {
        localStorage.setItem('qcmPreset', JSON.stringify(questionList));
    }, [questionList]);

    useEffect(() => {
        if (currentState !== 'creation') {
            if (currentState === 'ongoing') {
                if (currentQuestionIndex < questionList.length) {
                    socket.emit('QCMQuestion', [
                        currentQuestionIndex,
                        questionList[currentQuestionIndex].question,
                        questionList[currentQuestionIndex].answers,
                        newQcm,
                    ]);
                    setNewQcm(false);
                }
            }
        }
    }, [currentState, currentQuestionIndex, socket]);

    useEffect(() => {
        socket.on('answer', ([answerNum, id]) => {
            if (Number(id) === currentQuestionIndex) {
                setQuestionList(
                    questionList.map((qcm, i) => {
                        if (i === Number(id)) {
                            qcm.answers[answerNum].counter++;
                        }
                        return qcm;
                    })
                );
            }
        });

        return () => {
            console.log('off');
            socket.off('answer');
        };
    }, [socket, currentQuestionIndex, questionList]);

    if (currentState === 'awaiting') {
        return (
            <div className={style.mainAwaiting}>
                <p className={style.presetName}>List of questions</p>

                <div>
                    <DisplayQuestions questionList={questionList} />
                    <div>
                        <button onClick={() => setCurrentState('creation')}>
                            back
                        </button>
                        <button
                            onClick={() => {
                                setNewQcm(true);
                                resetCounter();
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
                            {!(currentQuestionIndex >= questionList.length) && (
                                <table>
                                    <thead>
                                        <tr>
                                            {questionList[
                                                currentQuestionIndex
                                            ].answers.map((answer, i) => (
                                                <th key={'answer ' + i}>
                                                    {answer.answer}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {questionList[
                                                currentQuestionIndex
                                            ].answers.map((answer, i) => (
                                                <td key={'answer count ' + i}>
                                                    {answer.counter}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setCurrentState('creation');
                                    setCurrentQuestionIndex(0);
                                    resetCounter();
                                    socket.emit('QCMEvent', 'end');
                                }}
                            >
                                exit
                            </button>

                            <div>
                                {
                                    /* eslint-disable indent*/ !(
                                        currentQuestionIndex >=
                                        questionList.length
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
                                        )
                                }
                                {
                                    !(
                                        currentQuestionIndex >=
                                        questionList.length
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
                                    )
                                    /* eslint-enable indent*/
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (currentState === 'creation') {
        console.log(questionList);
        return (
            <div className={style.main}>
                <form
                    name='questions'
                    onSubmit={(e) => {
                        e.preventDefault();
                        const inputs: {
                            question: string;
                            answers: { counter: number; answer: string }[];
                        } = {
                            question: '',
                            answers: [],
                        };

                        inputs.question = question;

                        answers.forEach((answer) => {
                            if (answer === '') return;
                            inputs.answers.push({
                                counter: 0,
                                answer,
                            });
                        });

                        console.info('inputs', inputs);

                        setQuestionList((list) => [...list, inputs]);
                    }}
                >
                    <input
                        required={true}
                        name='question'
                        type='text'
                        placeholder='question'
                        onChange={(e) => setQuestion(e.target.value)}
                        value={question}
                    ></input>

                    {Array.from({
                        length: maxAnswersNum,
                    }).map((x, i) => (
                        <input
                            key={'input_answer' + (i + 1)}
                            name={'answer' + (i + 1)}
                            type='text'
                            placeholder={'answer ' + (i + 1)}
                            onChange={(e) =>
                                setAnswers((a) =>
                                    a.map((answer, j) =>
                                        j === i ? e.target.value : answer
                                    )
                                )
                            }
                            value={answers[i]}
                        ></input>
                    ))}

                    <button type='submit'>add question</button>
                </form>
                {questionList.length > 0 && (
                    <p className={style.presetName}>Question list</p>
                )}

                <DisplayQuestions questionList={questionList} />
                <div>
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
                                onClick={() => {
                                    setCurrentState('awaiting');
                                }}
                            >
                                next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
