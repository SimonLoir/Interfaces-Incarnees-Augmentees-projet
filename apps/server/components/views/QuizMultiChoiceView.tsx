import { ReactElement, useEffect, useState } from 'react';
import style from '@style/QuizMultiChoice.module.scss';
import { listenerCount } from 'process';

type stateType = 'creation' | 'awaiting' | 'ongoing';

function updateInputs(list: string[], value: string, index: number) {
    list[index] = value;
    return list;
}

export default function QuizMultiChoice() {
    const [inputValues, setInputValues] = useState<string[]>([]);
    const [questionList, setQuestionList] = useState<string[][]>([]);
    const [currentState, setCurrentState] = useState<stateType>('creation');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    if (currentState === 'awaiting') {
        return (
            <div className={style.mainAwaiting}>
                <p>Waiting for people to connect</p>
                <div>
                    <ul>
                        {questionList.map((question) => {
                            return <li>{question}</li>;
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
                <div className={style.question}>
                    <p>{questionList[currentQuestionIndex]}</p>
                </div>
                <div className={style.menu}>
                    {!(currentQuestionIndex >= questionList.length) && (
                        <div>
                            <div>
                                <table>
                                    <tr>
                                        <th>answers : </th>
                                        <th>Answer 1</th>
                                        <th>Answer 2</th>
                                        <th>Answer 3</th>
                                        <th>Answer 4</th>
                                        <th>Answer 5</th>
                                    </tr>
                                </table>
                            </div>
                            {currentQuestionIndex > 0 && (
                                <button
                                    onClick={() =>
                                        setCurrentQuestionIndex((i) => i - 1)
                                    }
                                >
                                    back
                                </button>
                            )}
                            <button
                                onClick={() =>
                                    setCurrentQuestionIndex((i) => i + 1)
                                }
                            >
                                next
                            </button>
                        </div>
                    )}
                    <button onClick={() => setCurrentState('creation')}>
                        exit
                    </button>
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
                        let inputs: string[] = [];
                        inputs.push(e.target.question.value);
                        if (e.target.answer1.value !== '')
                            inputs.push(e.target.answer1.value);
                        if (e.target.answer2.value !== '')
                            inputs.push(e.target.answer2.value);
                        if (e.target.answer3.value !== '')
                            inputs.push(e.target.answer3.value);
                        if (e.target.answer4.value !== '')
                            inputs.push(e.target.answer4.value);
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
                        required={true}
                        name='answer3'
                        type='text'
                        placeholder='answer 3'
                    ></input>
                    <input
                        required={true}
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
                        <ul id='renderedList'>
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
