import { useCallback, useEffect, useState } from 'react';
import QCMAddQuestion from './QCMAddQuestion';
import QCMListQuestions from './QCMListQuestions';

export type QCMStates = 'edit' | 'list_questions' | 'awaiting' | 'ongoing';
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

    let content = <></>;
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
            content = <QCMAddQuestion goTo={setQcmState} />;
            break;
        case 'awaiting':
            content = <div>Awaiting</div>;
            break;
        case 'ongoing':
            content = <div>Ongoing</div>;
            break;
    }
    return <div className='center'>{content}</div>;
}
