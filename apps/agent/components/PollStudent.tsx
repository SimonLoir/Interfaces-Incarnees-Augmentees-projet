import { useState } from 'react';

export default function PollStudents() {
    const [status, setStatus] = useState<boolean | undefined>();
    const [question, setQuestion] = useState<string>();

    return (
        <div>
            {question ? (
                <div>
                    {question}
                    <button
                        style={{
                            backgroundColor: status === true ? 'green' : 'gray',
                        }}
                        onClick={() => {
                            setStatus(true);
                        }}
                    >
                        Vrai
                    </button>
                    <button
                        style={{
                            backgroundColor: status === false ? 'red' : 'gray',
                        }}
                        onClick={() => {
                            setStatus(true);
                        }}
                    >
                        Faux
                    </button>
                </div>
            ) : (
                'Pas de question'
            )}
        </div>
    );
}
