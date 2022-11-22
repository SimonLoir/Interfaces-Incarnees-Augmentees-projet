import { Question } from '.';
import ProgressBar from './ProgressBar';

type PollResultsProps = {
    questionList: Question[];
    exitPoll: () => void;
};
export default function PollResults({
    questionList,
    exitPoll,
}: PollResultsProps) {
    return (
        <div className='center'>
            <div style={{ textAlign: 'center' }}>
                <h2>Résultats</h2>
                <div
                    style={{
                        maxHeight: '50',
                        overflow: 'auto',
                        marginBottom: '15px',
                    }}
                >
                    {questionList.map((question, index) => (
                        <div key={index}>
                            <p style={{ margin: '5px' }}>{question.question}</p>
                            <ProgressBar
                                progress={
                                    question.counter[0] === question.counter[1]
                                        ? 50
                                        : (question.counter[0] /
                                              (question.counter[0] +
                                                  question.counter[1])) *
                                          100
                                }
                                forCount={question.counter[0]}
                                against={question.counter[1]}
                            />
                        </div>
                    ))}
                </div>
                <button onClick={exitPoll} className='button'>
                    Quitter
                </button>
            </div>
        </div>
    );
}
