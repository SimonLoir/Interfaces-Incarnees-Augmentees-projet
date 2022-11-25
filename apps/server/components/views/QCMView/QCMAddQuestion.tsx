import { useState, useEffect, useCallback } from 'react';
import { QCMQuestion, QCMStates } from '.';
import style from '@style/QCMCreation.module.scss';
import { useSocketContext } from '@utils/global';
import { BsArrowClockwise, BsArrowCounterclockwise } from 'react-icons/bs';

type AddQuestionProps = {
    goTo: (state: QCMStates) => void;
    addQuestion: (question: QCMQuestion) => void;
};
export default function QCMAddQuestion({
    goTo,
    addQuestion,
}: AddQuestionProps) {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']);
    const socket = useSocketContext();

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const addQuestionToList = useCallback(() => {
        const questionText = question.trim();

        if (questionText === '')
            return alert('Merci de renseigner une question');

        const opt = options.filter((o) => o.trim() !== '');

        if (opt.length < 2)
            return alert('Merci de renseigner au moins 2 options');

        addQuestion({
            question: questionText,
            answers: opt.map((o) => ({ answer: o, counter: 0 })),
        });
        goTo('list_questions');
    }, [addQuestion, goTo, options, question]);

    useEffect(() => {
        socket.on('thumbs_left_gesture', () => {
            setOptions((o) => [...o, '']);
        });

        socket.on('thumbs_down_gesture', () => {
            goTo('list_questions');
        });

        socket.on('thumbs_right_gesture', () => {
            addQuestionToList();
        });

        return () => {
            socket.off('thumbs_left_gesture');
            socket.off('thumbs_down_gesture');
            socket.off('thumbs_right_gesture');
        };
    }, [socket, addQuestionToList, goTo]);

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
                        placeholder={`Choix ${index + 1}`}
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
                    <BsArrowCounterclockwise className='va-middle' />{' '}
                    <span className='va-middle'>Ajouter un choix</span>
                </button>
                <button
                    onClick={() => goTo('list_questions')}
                    className={'button'}
                >
                    Annuler 👎
                </button>
                <button className={'button'} onClick={addQuestionToList}>
                    <span className='va-middle'>Ajouter la question</span>{' '}
                    <BsArrowClockwise className='va-middle' />
                </button>
            </div>
        </div>
    );
}
