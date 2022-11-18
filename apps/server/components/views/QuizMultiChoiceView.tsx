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
    >([]);
    const [currentState, setCurrentState] = useState<stateType>('creation');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [newQcm, setNewQcm] = useState<boolean>(true);
    const [answer1, setAnswer1] = useState('');
    const [answer2, setAnswer2] = useState('');
    const [answer3, setAnswer3] = useState('');
    const [answer4, setAnswer4] = useState('');
    const [answer5, setAnswer5] = useState('');
    const [question, setQuestion] = useState('');
    const setters = [
        setAnswer1,
        setAnswer2,
        setAnswer3,
        setAnswer4,
        setAnswer5,
    ];
    const answers = [answer1, answer2, answer3, answer4, answer5];

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
                    <DisplayQuestions
                        questionList={questionList}
                        maxAnswersNum={maxAnswersNum}
                    />
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
                                            {Array.from({
                                                length: maxAnswersNum,
                                            }).map((x, i) => (
                                                <th key={'answer ' + i}>
                                                    {
                                                        questionList[
                                                            currentQuestionIndex
                                                        ].answers[i].answer
                                                    }
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {Array.from({
                                                length: maxAnswersNum,
                                            }).map((x, i) => (
                                                <td key={'answer count ' + i}>
                                                    {
                                                        questionList[
                                                            currentQuestionIndex
                                                        ].answers[i].counter
                                                    }
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

                        if (answer1 !== '')
                            inputs.answers.push({
                                counter: 0,
                                answer: answer1,
                            });
                        if (answer2 !== '')
                            inputs.answers.push({
                                counter: 0,
                                answer: answer2,
                            });
                        if (answer3 !== '')
                            inputs.answers.push({
                                counter: 0,
                                answer: answer3,
                            });
                        if (answer5 !== '')
                            inputs.answers.push({
                                counter: 0,
                                answer: answer4,
                            });
                        if (answer5 !== '')
                            inputs.answers.push({
                                counter: 0,
                                answer: answer5,
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
                            required={true}
                            name={'answer' + (i + 1)}
                            type='text'
                            placeholder={'answer ' + (i + 1)}
                            onChange={(e) => setters[i](e.target.value)}
                            value={answers[i]}
                        ></input>
                    ))}

                    <button type='submit'>add question</button>
                </form>
                {questionList.length > 0 && (
                    <p className={style.presetName}>Unnamed preset</p>
                )}

                <DisplayQuestions
                    questionList={questionList}
                    maxAnswersNum={maxAnswersNum}
                />
                <div>
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
