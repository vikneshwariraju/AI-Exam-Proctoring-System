import "../../styles/exam.css";

const QuestionPalette = ({
  questions,
  answers,
 currentIndex,
  onJump,
  onSubmit,
}) => {

  const answered = Object.keys(answers).length;
  const remaining = questions.length - answered;

  return (
    <div className="palette-card">

      <h5 className="fw-bold mb-3">
        Question Palette
      </h5>

      <div className="palette-grid">

        {questions.map((q, index) => {

          const answeredQuestion = answers[q.id] !== undefined;

          let className = "palette-btn palette-normal";

          if (answeredQuestion)
            className = "palette-btn palette-answer";

          if (index === currentIndex)
            className = "palette-btn palette-current";

          return (
            <button
              key={q.id}
              className={className}
              onClick={() => onJump(index)}
            >
              {index + 1}
            </button>
          );

        })}

      </div>

      <hr />

      <div className="mt-3">

        <div className="d-flex justify-content-between mb-2">
          <span>Answered</span>
          <strong>{answered}</strong>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>Remaining</span>
          <strong>{remaining}</strong>
        </div>

        <div className="d-flex justify-content-between">
          <span>Total Questions</span>
          <strong>{questions.length}</strong>
        </div>

      </div>

      <div className="mt-4">

        <h6 className="fw-bold mb-3">
          Legend
        </h6>

        <div className="legend">

          <div>
            <span className="box green"></span>
            Answered
          </div>

          <div>
            <span className="box blue"></span>
            Current
          </div>

          <div>
            <span className="box gray"></span>
            Not Visited
          </div>

        </div>

      </div>

      <button
        className="btn btn-danger submit-btn mt-4"
        onClick={onSubmit}
      >
        Submit Exam
      </button>

    </div>
  );
};

export default QuestionPalette;