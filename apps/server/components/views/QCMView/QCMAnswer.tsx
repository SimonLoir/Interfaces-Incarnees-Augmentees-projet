import React from 'react';
import answer from '@style/QCMAnswer.module.scss';
type QCMAnswerProps = {
    choice: string;
    count: number;
    max: number;
};
export default function QCMAnswer({ choice, count, max }: QCMAnswerProps) {
    return (
        <div>
            {choice}
            <br />
            <div className={answer.bar}>
                <div
                    style={{
                        width: `${Math.floor(count / max ?? 1) * 100}%`,
                    }}
                >
                    {count}
                </div>
            </div>
        </div>
    );
}
