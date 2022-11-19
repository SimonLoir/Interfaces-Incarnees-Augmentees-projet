export default function DisplayQuestions({
    questionList,
}: {
    questionList: {
        question: string;
        answers: { counter: number; answer: string }[];
    }[];
}): JSX.Element {
    return (
        <div>
            {questionList.length > 0 && (
                <ul>
                    {questionList.map((qcm, index) => {
                        return (
                            <li key={'question ' + index}>
                                <p
                                    style={{
                                        color: 'rgb(175, 48, 51)',
                                        border: 'none',
                                    }}
                                >
                                    {qcm.question}
                                </p>
                                {qcm.answers.map((x, i) => (
                                    <p
                                        key={
                                            'display question ' +
                                            index +
                                            ' answer ' +
                                            (i + 1)
                                        }
                                        style={{
                                            color: 'blue',
                                        }}
                                    >
                                        {qcm.answers[i].answer}
                                    </p>
                                ))}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
