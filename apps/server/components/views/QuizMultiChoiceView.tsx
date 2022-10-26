import { ReactElement, useEffect, useState } from 'react';
import style from '@style/QuizMultiChoice.module.scss';

type stateType = 'creation' | 'awaiting' | 'ongoing';


export default function QuizMultiChoice() {
  const [questionList, setQuestionList] = useState<Array<string>>([]);
  const [currentState, setCurrentState] = useState<stateType>('creation');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  if (currentState === 'awaiting') {
      return (
          <div className={style.mainAwaiting}>
              <p>Waiting for people to connect</p>
              <div>
                  <div>
                      {questionList.map((question) => {
                          return <p>{question}</p>;
                      })}
                  </div>
                  <button onClick={() => setCurrentState('creation')}>
                      back
                  </button>
                  <button onClick={() => setCurrentState('ongoing')}>
                      start poll
                  </button>
              </div>
          </div>
      );
  }
  if (currentState === 'ongoing') {
      return (
          <div className={style.mainOngoing}>
              <div className={style.question}>
                  <p>{questionList[currentQuestionIndex]}</p>
              </div>
              <div className={style.menu}>
                  {!(currentQuestionIndex >= questionList.length) && (
                      <div>
                          <div>
                              <table>
                                  <tr>
                                      <th>answers : </th>
                                      <th>Answer 1</th>
                                      <th>Answer 2</th>
                                      <th>Answer 3</th>
                                      <th>Answer 4</th>
                                      <th>Answer 5</th>
                                  </tr>
                              </table>
                          </div>
                          {currentQuestionIndex > 0 && (
                              <button
                                  onClick={() =>
                                      setCurrentQuestionIndex((i) => i - 1)
                                  }
                              >
                                  back
                              </button>
                          )}
                          <button
                              onClick={() =>
                                  setCurrentQuestionIndex((i) => i + 1)
                              }
                          >
                              next
                          </button>
                      </div>
                  )}
                  <button onClick={() => setCurrentState('creation')}>
                      exit
                  </button>
              </div>
          </div>
      );
  }

  if (currentState === 'creation') {
      return (
          <div className={style.main}>
              <form
                  name='questions'
                  onSubmit={(e) => {
                      e.preventDefault();
                      setQuestionList((list) => [
                          ...list,
                          document.forms.questions.elements.question_input
                              .value,
                      ]);
                      console.log(questionList);
                  }}
              >
                  <input
                      required={true}
                      name='question_input'
                      type='text'
                      placeholder='question'
                  ></input>
                  <button type='submit'>add question</button>
              </form>
              <div>
                  {questionList.length > 0 && (
                      <div>
                          {questionList.map((question) => {
                              return <p>{question}</p>;
                          })}
                      </div>
                  )}

                  {questionList.length !== 0 && (
                      <button
                          type='button'
                          onClick={() => setCurrentState('awaiting')}
                      >
                          Start poll
                      </button>
                  )}
              </div>
          </div>
      );
  }
}
