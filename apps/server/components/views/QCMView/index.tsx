import { useCallback, useEffect, useState } from 'react';
import QCMAddQuestion from './QCMAddQuestion';
import QCMAwaitingUsers from './QCMAwaitingUsers';
import QCMListQuestions from './QCMListQuestions';
import QCMOngoing from './QCMOngoing';
import QCMResults from './QCMResults';

export type QCMStates =
    | 'edit'
    | 'list_questions'
    | 'awaiting'
    | 'ongoing'
    | 'results';
export type QCMQuestionOption = { counter: number; answer: string };
export type QCMQuestion = {
    question: string;
    answers: QCMQuestionOption[];
};
export default function QCMView() {
    const [questionList, setQuestionList] = useState<QCMQuestion[]>(() => {
        const initPreset = localStorage.getItem('qcmPreset');
        if (initPreset) return JSON.parse(initPreset);
        return [];
    });

    const [qcmState, setQcmState] = useState<QCMStates>('list_questions');

    useEffect(() => {
        localStorage.setItem('qcmPreset', JSON.stringify(questionList));
    }, [questionList]);

    const clearQcm = useCallback(() => {
        setQuestionList([]);
    }, []);

    const addQuestion = useCallback((question: QCMQuestion) => {
        setQuestionList((q) => [...q, question]);
    }, []);

    const resetAnswers = useCallback(() => {
        setQuestionList((q) => {
            return q.map((question) => {
                return {
                    ...question,
                    answers: question.answers.map((answer) => {
                        return { ...answer, counter: 0 };
                    }),
                };
            });
        });
    }, []);

    let content: JSX.Element;
    switch (qcmState) {
        case 'list_questions':
            content = (
                <QCMListQuestions
                    goTo={setQcmState}
                    questionList={questionList}
                    clearQcm={clearQcm}
                />
            );
            break;
        case 'edit':
            content = (
                <QCMAddQuestion goTo={setQcmState} addQuestion={addQuestion} />
            );
            break;
        case 'awaiting':
            content = (
                <QCMAwaitingUsers
                    goTo={setQcmState}
                    resetAnswers={resetAnswers}
                />
            );
            break;
        case 'ongoing':
            content = (
                <QCMOngoing
                    questionList={questionList}
                    setQuestionList={setQuestionList}
                    goTo={setQcmState}
                />
            );
            break;

        case 'results':
            content = (
                <QCMResults questionList={questionList} goTo={setQcmState} />
            );
    }
    return <div className='center'>{content}</div>;
}
