import { ReactElement, useEffect, useState } from 'react';
import style from '@style/QuizSingleChoice.module.scss';
import { useSocketContext } from '@utils/global';

type stateType = 'creation' | 'awaiting' | 'ongoing';

export default function QuizSingleChoice() {
    const [questionList, setQuestionList] = useState<Array<string>>([]);
    const [answerCounter, setAnswerCounter] = useState<number[]>([0, 0]);
    const [currentState, setCurrentState] = useState<stateType>('creation');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const socket = useSocketContext();

    useEffect(() => {
        if (currentState !== 'creation') {
            socket.on('new-poll-participation', (id) => {
                console.log('new poll participant : ' + id);
            });
            if (currentState === 'ongoing') {
                socket.on('approval', (id) => {
                    console.log('user ' + id + ' approved');
                    setAnswerCounter(([approval, refusal]) => [
                        approval + 1,
                        refusal,
                    ]);
                });
                socket.on('refusal', (id) => {
                    console.log('user ' + id + ' refused');
                    setAnswerCounter(([approval, refusal]) => [
                        approval,
                        refusal + 1,
                    ]);
                });
            }
        } else {
            socket.off('new-poll-participation');
            socket.off('approval');
            socket.off('refusal');
        }
    }, [socket]);

    if (currentState === 'awaiting') {
        return (
            <div className={style.mainAwaiting}>
                <p>Waiting for people to connect</p>
                <div>
                    <div>
                        {questionList.map((question) => {
                            return <p>{question}</p>;
                        })}
                    </div>
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
                            {!(currentQuestionIndex >= questionList.length) && (
                                <table>
                                    <tr>
                                        <th>answers : </th>
                                        <th>{answerCounter[0]}</th>
                                        <th>{answerCounter[1]}</th>
                                    </tr>
                                </table>
                            )}
                        </div>
                        <div>
                            <div>
                                {!(
                                    currentQuestionIndex >= questionList.length
                                ) &&
                                    currentQuestionIndex > 0 && (
                                        <button
                                            onClick={() => {
                                                setCurrentQuestionIndex(
                                                    (i) => i - 1
                                                );
                                                setAnswerCounter([0, 0]);
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
                                                (i) => i + 1
                                            );
                                            setAnswerCounter([0, 0]);
                                        }}
                                    >
                                        next
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setCurrentState('creation');
                                    setCurrentQuestionIndex(0);
                                }}
                            >
                                exit
                            </button>
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
                        setQuestionList((list) => [
                            ...list,
                            document.forms.questions.elements.question_input
                                .value,
                        ]);
                        console.log(questionList);
                    }}
                >
                    <input
                        required={true}
                        name='question_input'
                        type='text'
                        placeholder='question'
                    ></input>
                    <button type='submit'>add question</button>
                </form>
                <div>
                    {questionList.length > 0 && (
                        <ul>
                            {questionList.map((question) => {
                                return <li>{question}</li>;
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
