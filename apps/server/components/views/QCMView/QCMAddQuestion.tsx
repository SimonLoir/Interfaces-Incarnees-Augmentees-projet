import { useState } from 'react';
import { QCMStates } from '.';
import style from '@style/QCMCreation.module.scss';

type AddQuestionProps = {
    goTo: (state: QCMStates) => void;
};
export default function QCMAddQuestion({ goTo }: AddQuestionProps) {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']);
    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };
    return (
        <div className={style.main}>
            <input
                type='text'
                placeholder='Question'
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={style.input}
            />
            {options.map((option, index) => (
                <div key={index} className={style.option}>
                    <input
                        type='text'
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[index] = e.target.value;
                            setOptions(newOptions);
                        }}
                        className={style.input}
                    />
                    {/* Lets the user remove an option from the list*/}
                    {options.length > 2 && (
                        <button onClick={() => removeOption(index)}>×</button>
                    )}
                </div>
            ))}
            <div>
                <button
                    className={'button'}
                    onClick={() => setOptions((o) => [...o, ''])}
                >
                    Ajouter une option
                </button>
                <button
                    onClick={() => goTo('list_questions')}
                    className={'button'}
                >
                    Annuler
                </button>
                <button className={'button'}>Ajouter la question</button>
            </div>
        </div>
    );
}
