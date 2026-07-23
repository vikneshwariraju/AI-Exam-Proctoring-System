import "./../../styles/exam.css";

const QuestionCard = ({
  question,
  index,
  total,
  selectedIndex,
  onSelect,
}) => {
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
          1 Mark
        </div>

      </div>

      {/* Options */}

      <div>

        {question.options.map((option, i) => (

          <div
            key={i}
            className={`option-card ${
              selectedIndex === i
                ? "option-selected"
                : ""
            }`}
            onClick={() => onSelect(i)}
          >

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

          </div>

        ))}

      </div>

    </div>
  );
};

export default QuestionCard;