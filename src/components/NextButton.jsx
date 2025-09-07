import { useQuiz } from "../contexts/QuizContext";

export default function NextButton() {
  const { dispatch, answer, index, numQuestions } = useQuiz();
  const lastQuestion = index === numQuestions - 1;
  if (answer === null) return;
  return (
    <button
      className="btn btn-ui"
      onClick={() =>
        dispatch({ type: `${!lastQuestion ? "nextQuestion" : "finished"}` })
      }
    >
      {!lastQuestion ? "Next" : "Finish"}
    </button>
  );
}
