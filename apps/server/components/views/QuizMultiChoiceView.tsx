import { ReactElement, useEffect, useState } from 'react';
import style from '@style/QuizMultiChoice.module.scss';
import { useSocketContext } from '@utils/global';

type stateType = 'creation' | 'awaiting' | 'ongoing';

function updateInputs(list: string[], value: string, index: number) {
    list[index] = value;
    return list;
}

export default function QuizMultiChoice() {
    const [questionList, setQuestionList] = useState<string[][]>([]);
    const [currentState, setCurrentState] = useState<stateType>('creation');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerCounter, setAnswerCounter] = useState<{
        [id: string]: [number, number, number, number];
    }>({ 0: [0, 0, 0, 0] });
    const socket = useSocketContext();

    useEffect(() => {
        if (currentState !== 'creation') {
            if (currentState === 'ongoing') {
                if (currentQuestionIndex < questionList.length) {
                    socket.emit('QCMQuestion', [
                        currentQuestionIndex,
                        questionList[currentQuestionIndex],
                    ]);
                    console.log('emitted question');
                }

                socket.on('answer1', (id) => {
                    console.log('user answered 1');
                    const answers = { ...answerCounter };
                    answers[id][1] = answers[id][1] + 1;
                    setAnswerCounter(answers);
                });
                socket.on('answer2', (id) => {
                    console.log('user answered 2');
                    const answers = { ...answerCounter };
                    answers[id][2] = answers[id][2] + 1;
                    setAnswerCounter(answers);
                });
                socket.on('answer3', (id) => {
                    console.log('user answered 1');
                    const answers = { ...answerCounter };
                    answers[id][3] = answers[id][3] + 1;
                    setAnswerCounter(answers);
                });
                socket.on('answer4', (id) => {
                    console.log('user answered 2');
                    const answers = { ...answerCounter };
                    answers[id][4] = answers[id][4] + 1;
                    setAnswerCounter(answers);
                });
            }
        }
        return () => {
            socket.off('answer1');
            socket.off('answer2');
            socket.off('answer3');
            socket.off('answer4');
        };
    }, [currentQuestionIndex, currentState, questionList, socket]);

    if (currentState === 'awaiting') {
        return (
            <div className={style.mainAwaiting}>
                <p>Waiting for people to connect</p>
                <p className={style.presetName}>Unnamed preset</p>
                <div>
                    <ul>
                        {questionList.map((question) => {
                            return (
                                <li>
                                    <p
                                        style={{
                                            color: 'rgb(175, 48, 51)',
                                            border: 'none',
                                        }}
                                    >
                                        {question[0]}
                                    </p>
                                    <p
                                        style={{
                                            color: 'blue',
                                        }}
                                    >
                                        {question[1]}
                                    </p>
                                    <p
                                        style={{
                                            color: 'blue',
                                        }}
                                    >
                                        {question[2]}
                                    </p>
                                    <p
                                        style={{
                                            color: 'blue',
                                        }}
                                    >
                                        {question[3]}
                                    </p>
                                    <p
                                        style={{
                                            color: 'blue',
                                        }}
                                    >
                                        {question[4]}
                                    </p>
                                </li>
                            );
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
                        <p>{questionList[currentQuestionIndex][0]}</p>
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
                                            <th>
                                                {
                                                    questionList[
                                                        currentQuestionIndex
                                                    ][1]
                                                }
                                            </th>
                                            <th>
                                                {
                                                    questionList[
                                                        currentQuestionIndex
                                                    ][2]
                                                }
                                            </th>
                                            <th>
                                                {
                                                    questionList[
                                                        currentQuestionIndex
                                                    ][3]
                                                }
                                            </th>
                                            <th>
                                                {
                                                    questionList[
                                                        currentQuestionIndex
                                                    ][4]
                                                }
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>0</th>
                                            <th>0</th>
                                            <th>0</th>
                                            <th>0</th>
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
                                                    const i =
                                                        currentQuestionIndex -
                                                        1;
                                                    setAnswerCounter(
                                                        (answers) => {
                                                            answers[i] = [
                                                                0, 0, 0, 0,
                                                            ];
                                                            return {
                                                                ...answers,
                                                            };
                                                        }
                                                    );
                                                    setCurrentQuestionIndex(
                                                        (i) => i - 1
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
                                                const i =
                                                    currentQuestionIndex + 1;
                                                //Resets the given answers of the students to allow them to re-answer to that question
                                                setAnswerCounter((answers) => {
                                                    answers[i + 1] = [
                                                        0, 0, 0, 0,
                                                    ];
                                                    return { ...answers };
                                                });
                                                setCurrentQuestionIndex(
                                                    (i) => i + 1
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
                        const inputs: string[] = [];
                        inputs.push(e.target.question.value);
                        if (e.target.answer1.value !== '')
                            inputs.push(e.target.answer1.value);
                        if (e.target.answer2.value !== '')
                            inputs.push(e.target.answer2.value);
                        if (e.target.answer3.value !== '')
                            inputs.push(e.target.answer3?.value);
                        if (e.target.answer4.value !== '')
                            inputs.push(e.target.answer4?.value);
                        setQuestionList((list) => [...list, inputs]);
                        console.log(questionList);
                    }}
                >
                    <input
                        required={true}
                        name='question'
                        type='text'
                        placeholder='question'
                    ></input>
                    <input
                        required={true}
                        name='answer1'
                        type='text'
                        placeholder='answer 1'
                    ></input>
                    <input
                        required={true}
                        name='answer2'
                        type='text'
                        placeholder='answer 2'
                    ></input>
                    <input
                        required={false}
                        name='answer3'
                        type='text'
                        placeholder='answer 3'
                    ></input>
                    <input
                        required={false}
                        name='answer4'
                        type='text'
                        placeholder='answer 4'
                    ></input>
                    <button type='submit'>add question</button>
                </form>
                {questionList.length > 0 && (
                    <p className={style.presetName}>Unnamed preset</p>
                )}
                <div>
                    {questionList.length > 0 && (
                        <ul>
                            {questionList.map((question) => {
                                return (
                                    <li>
                                        <p
                                            style={{
                                                color: 'rgb(175, 48, 51)',
                                                border: 'none',
                                            }}
                                        >
                                            {question[0]}
                                        </p>
                                        <p
                                            style={{
                                                color: 'blue',
                                            }}
                                        >
                                            {question[1]}
                                        </p>
                                        <p
                                            style={{
                                                color: 'blue',
                                            }}
                                        >
                                            {question[2]}
                                        </p>
                                        <p
                                            style={{
                                                color: 'blue',
                                            }}
                                        >
                                            {question[3]}
                                        </p>
                                        <p
                                            style={{
                                                color: 'blue',
                                            }}
                                        >
                                            {question[4]}
                                        </p>
                                    </li>
                                );
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
