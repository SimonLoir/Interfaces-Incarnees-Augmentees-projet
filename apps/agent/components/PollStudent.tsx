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
                        style={
                            status === undefined
                                ? {
                                      backgroundColor: 'rgb(175, 48, 51)',
                                      color: 'white',
                                      pointerEvents: 'none',
                                  }
                                : status === true
                                ? {
                                      backgroundColor: 'rgb(175, 48, 51)',
                                      color: 'goldenrod',
                                      pointerEvents: 'none',
                                  }
                                : {
                                      backgroundColor: 'gray',
                                      color: 'white',
                                      pointerEvents: 'auto',
                                  }
                        }
                        onClick={() => {
                            setStatus(true);
                        }}
                    >
                        Vrai
                    </button>
                    <button
                        style={
                            status === undefined
                                ? {
                                      backgroundColor: 'rgb(175, 48, 51)',
                                      color: 'white',
                                      pointerEvents: 'auto',
                                  }
                                : status === false
                                ? {
                                      backgroundColor: 'rgb(175, 48, 51)',
                                      color: 'goldenrod',
                                      pointerEvents: 'none',
                                  }
                                : {
                                      backgroundColor: 'gray',
                                      color: 'white',
                                      pointerEvents: 'auto',
                                  }
                        }
                        onClick={() => {
                            setStatus(false);
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
