import { QCMQuestion, QCMStates } from '.';

type ListQuestionsProps = {
    goTo: (state: QCMStates) => void;
    questionList: QCMQuestion[];
    clearQcm: () => void;
};
export default function QCMListQuestions({
    goTo,
    questionList,
    clearQcm,
}: ListQuestionsProps) {
    const addQuestionButton = (
        <button onClick={() => goTo('edit')} className={'button'}>
            Ajouter une question
        </button>
    );
    if (questionList.length === 0)
        return (
            <div style={{ textAlign: 'center' }}>
                <p>Ajoutez une question pour lancer le questionnaire.</p>
                {addQuestionButton}
            </div>
        );
    return (
        <div>
            {JSON.stringify(questionList)}
            <button onClick={clearQcm}></button>
            {addQuestionButton}
        </div>
    );
}
