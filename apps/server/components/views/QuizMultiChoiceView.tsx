import { ReactElement, useEffect, useState } from 'react';
import style from '@style/QuizMultiChoice.module.scss';
import { useSocketContext } from '@utils/global';
import DisplayQuestion from 'components/DisplayQuestions';
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
            answers: string[];
        }[]
    >([]);
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
                        questionList[currentQuestionIndex].question,
                        questionList[currentQuestionIndex].answers,
                    ]);
                    console.log('emitted question');
                }

                socket.on('answer', (id, answerNum) => {
                    console.log('received answer');
                    const answers = { ...answerCounter };
                    answers[id][answerNum - 1]++;
                    setAnswerCounter(answers);
                });
            }
        }
        return () => {
            socket.off('answer');
        };
    }, [currentQuestionIndex, currentState, questionList, socket]);

    if (currentState === 'awaiting') {
        return (
            <div className={style.mainAwaiting}>
                <p>Waiting for people to connect</p>
                <p className={style.presetName}>Unnamed preset</p>

                <DisplayQuestions
                    questionList={questionList}
                    maxAnswersNum={maxAnswersNum}
                />
                <div>
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
                                                <th>
                                                    {
                                                        questionList[
                                                            currentQuestionIndex
                                                        ].answers[i]
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
                                                <th>
                                                    {
                                                        answerCounter[
                                                            currentQuestionIndex
                                                        ][i]
                                                    }
                                                </th>
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
                        const inputs: { question: string; answers: string[] } =
                            {
                                question: '',
                                answers: [],
                            };

                        inputs.question = e.target.question.value;

                        if (e.target.answer1.value !== '')
                            inputs.answers.push(e.target.answer1.value);
                        if (e.target.answer2.value !== '')
                            inputs.answers.push(e.target.answer2.value);
                        if (e.target.answer3.value !== '')
                            inputs.answers.push(e.target.answer3?.value);
                        if (e.target.answer4.value !== '')
                            inputs.answers.push(e.target.answer4?.value);
                        if (e.target.answer5.value !== '')
                            inputs.answers.push(e.target.answer5?.value);
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

                    {Array.from({
                        length: maxAnswersNum,
                    }).map((x, i) => (
                        <input
                            key={'input_answer' + (i + 1)}
                            required={true}
                            name={'answer' + (i + 1)}
                            type='text'
                            placeholder={'answer ' + (i + 1)}
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
