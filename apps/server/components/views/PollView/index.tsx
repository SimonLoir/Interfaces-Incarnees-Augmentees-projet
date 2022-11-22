import { useCallback, useEffect, useState } from 'react';
import PollAwaiting from './PollAwaiting';
import PollCreation from './PollCreation';
import PollOngoing from './PollOngoing';
import PollResults from './PollResults';

type stateType = 'creation' | 'awaiting' | 'ongoing' | 'results';
export type Question = { question: string; counter: number[] };

export default function PollView() {
    const [currentState, setCurrentState] = useState<stateType>('creation');
    const [questionList, setQuestionList] = useState<Question[]>(() => {
        const initPreset = localStorage.getItem('pollPreset');
        if (initPreset) return JSON.parse(initPreset);
        return [];
    });

    useEffect(() => {
        localStorage.setItem(
            'pollPreset',
            JSON.stringify(questionList.map((q) => ({ ...q, counter: [0, 0] })))
        );
    }, [questionList]);

    const addQuestion = useCallback((question: string) => {
        setQuestionList((prev) => [...prev, { question, counter: [0, 0] }]);
    }, []);

    const clearQuestions = useCallback(() => {
        setQuestionList([]);
    }, []);

    const clearAnswers = useCallback(() => {
        setQuestionList((prev) => prev.map((q) => ({ ...q, counter: [0, 0] })));
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
                clearAnswers={clearAnswers}
            />
        );
    if (currentState === 'ongoing')
        return (
            <PollOngoing
                exitPoll={() => setCurrentState('creation')}
                questionList={questionList}
                setQuestionList={setQuestionList}
                showResults={() => setCurrentState('results')}
            />
        );
    return (
        <PollResults
            questionList={questionList}
            exitPoll={() => setCurrentState('creation')}
        />
    );
}
