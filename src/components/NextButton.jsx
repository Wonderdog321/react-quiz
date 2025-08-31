export default function NextButton({ dispatch, answer, index, numQuestions }) {
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
