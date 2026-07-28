import "./../../styles/exam.css";

/**
 * Two modes:
 *  - Live exam (default): showAnswer is false/omitted. Behaves exactly
 *    as before — just an answerable question, no correct answer shown.
 *  - Review mode: pass showAnswer={true} and correctIndex={<index>}.
 *    Options are colored so the student can see what was right, what
 *    they picked, and what they got wrong — this is what was missing
 *    from the result-review screen.
 */
const QuestionCard = ({
  question,
  index,
  total,
  selectedIndex,
  onSelect,
  marks,
  showAnswer = false,
  correctIndex,
}) => {
  const questionMarks = marks ?? question?.marks ?? 1;
  const correct = correctIndex ?? question?.correctIndex;

  const optionClass = (i) => {
    if (!showAnswer) {
      return `option-card ${selectedIndex === i ? "option-selected" : ""}`;
    }

    // Review mode: green on the correct option, red if the student
    // picked a wrong one, neutral for everything else.
    if (i === correct) return "option-card option-correct";
    if (i === selectedIndex && i !== correct) return "option-card option-incorrect";
    return "option-card";
  };

  return (
    <div className="exam-card">

      {/* Question Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <small className="text-muted">
            Question {index + 1} of {total}
          </small>

          <h4 className="mt-2 fw-bold">
            {question.text}
          </h4>
        </div>

        <div className="badge bg-primary fs-6">
          {questionMarks} {questionMarks === 1 ? "Mark" : "Marks"}
        </div>

      </div>

      {/* Options */}

      <div>

        {question.options.map((option, i) => (

          <div
            key={i}
            className={optionClass(i)}
            onClick={() => !showAnswer && onSelect(i)}
          >

            <div className="d-flex align-items-center justify-content-between">

              <div className="d-flex align-items-center">

                <input
                  className="form-check-input me-3"
                  type="radio"
                  checked={selectedIndex === i}
                  readOnly
                />

                <div>

                  <strong>
                    {String.fromCharCode(65 + i)}.
                  </strong>

                  {" "}

                  {option}

                </div>

              </div>

              {showAnswer && i === correct && (
                <span className="badge bg-success">Correct Answer</span>
              )}

              {showAnswer && i === selectedIndex && i !== correct && (
                <span className="badge bg-danger">Your Answer</span>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default QuestionCard;