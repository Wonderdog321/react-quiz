/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from "react";

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

const initalState = {
  questions: [],
  status: "loading", //loading, error, ready, active, finished states
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
  numQuestions: null,
  maxPossiblePoints: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        numQuestions: action.payload.length,
        maxPossiblePoints: action.payload.reduce(
          (prev, cur) => prev + cur.points,
          0
        ),
      };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer": {
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }
    case "nextQuestion":
      return { ...state, index: state.index++, answer: null };
    case "finished":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return {
        ...initalState,
        questions: state.questions,
        highScore: state.highScore,
        numQuestions: state.numQuestions,
        maxPossiblePoints: state.maxPossiblePoints,
        status: "ready",
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining--,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action Unknown.");
  }
}

function QuizProvider({ children }) {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highScore,
      secondsRemaining,
      numQuestions,
      maxPossiblePoints,
    },
    dispatch,
  ] = useReducer(reducer, initalState);
  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highScore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);

  if (context === undefined) {
    throw new Error("Outside of the quiz provider.");
  }

  return context;
}
export { QuizProvider, useQuiz };
