import { ReactElement, useEffect, useState } from 'react';
import style from '@style/QuizSingleChoice.module.scss';

export default function QuizSingleChoice() {
    const [questionList, setQuestionList] = useState<Array<string>>([]);

    return (
        <div className={style.main}>
            <form
                name='questions'
                onSubmit={(e) => {
                    e.preventDefault();
                    setQuestionList((list) => [
                        ...list,
                        document.forms.questions.elements.question_input.value,
                    ]);
                    console.log(questionList);
                }}
            >
                <input
                    required={true}
                    name='question_input'
                    type='text'
                    placeholder='Poll name'
                ></input>
                <button type='submit'>add question</button>
            </form>
            <div>
                {questionList.length > 0 && (
                    <div>
                        {questionList.map((question) => {
                            return <p>{question}</p>;
                        })}
                    </div>
                )}

                {questionList.length !== 0 && (
                    <button type='button' onClick={() => {}}>
                        Start quizz
                    </button>
                )}
            </div>
        </div>
    );
}
