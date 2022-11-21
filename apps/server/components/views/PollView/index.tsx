import { useCallback, useEffect, useState } from 'react';
import PollAwaiting from './PollAwaiting';
import PollCreation from './PollCreation';
import PollOngoing from './PollOngoing';

type stateType = 'creation' | 'awaiting' | 'ongoing';
export type Question = { question: string; counter: number[] };

export default function PollView() {
    const [currentState, setCurrentState] = useState<stateType>('creation');
    const [questionList, setQuestionList] = useState<Question[]>(() => {
        const initPreset = localStorage.getItem('pollPreset');
        if (initPreset) return JSON.parse(initPreset);
        return [];
    });

    useEffect(() => {
        localStorage.setItem('pollPreset', JSON.stringify(questionList));
    }, [questionList]);

    const addQuestion = useCallback((question: string) => {
        setQuestionList((prev) => [...prev, { question, counter: [0, 0] }]);
    }, []);

    const clearQuestions = useCallback(() => {
        setQuestionList([]);
    }, []);

    if (currentState === 'creation')
        return (
            <PollCreation
                startPoll={() => setCurrentState('awaiting')}
                questionList={questionList}
                addQuestion={addQuestion}
                clearQuestions={clearQuestions}
            />
        );

    if (currentState === 'awaiting')
        return (
            <PollAwaiting
                editQuestions={() => setCurrentState('creation')}
                startPoll={() => setCurrentState('ongoing')}
            />
        );

    return <PollOngoing exitPoll={() => setCurrentState('creation')} />;
}
