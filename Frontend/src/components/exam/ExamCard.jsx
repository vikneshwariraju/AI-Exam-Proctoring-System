import { HiMenuAlt2 } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const formatDateTime = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d)) return isoString;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const ExamCard = ({ exam }) => {
  const navigate = useNavigate();

  const isAvailable = exam.status === "available";
  const isCompleted = exam.status === "completed";
  // Anything else (e.g. "upcoming") falls through to the not-yet-open state.

  const badge = isAvailable
    ? { text: "Available", className: "badge-success" }
    : isCompleted
      ? { text: "Completed", className: "badge-warning" }
      : { text: "Upcoming", className: "badge-warning" };

  const handleClick = () => {
    if (isAvailable) {
      navigate(`/student/exams/${exam.id}/instructions`);
    } else if (isCompleted) {
      navigate(`/student/results/${exam.id}`);
    }
    // Upcoming exams: button is disabled, nothing to navigate to yet.
  };

  const buttonLabel = isAvailable
    ? "View Exam"
    : isCompleted
      ? "View Result"
      : `Starts ${formatDateTime(exam.startTime)}`;

  const buttonDisabled = !isAvailable && !isCompleted;

 return (
  <div
    className="card hover-lift mb-3"
    style={{
      padding: "18px",
      borderRadius: "16px",
    }}
  >
    <div className="row align-items-center">

      {/* Left Side */}
      <div className="col-md-8">

        <div className="d-flex align-items-center mb-2">

          <h5
            className="mb-0 fw-semibold"
            style={{
              color: "var(--color-text-primary)",
              fontSize: "18px",
            }}
          >
            {exam.title}
          </h5>

          <span
            className={badge.className}
            style={{ marginLeft: "12px" }}
          >
            {badge.text}
          </span>

        </div>

        <div
          className="text-muted"
          style={{ fontSize: "13px" }}
        >
          <strong>{exam.subject}</strong>

          <span className="mx-2">•</span>

          {exam.duration} mins

          <span className="mx-2">•</span>

          {exam.totalMarks} Marks
        </div>

      </div>

      {/* Right Side */}
      <div className="col-md-4 text-md-end mt-3 mt-md-0">

        <button
          className={
            isAvailable || isCompleted
              ? "btn-primary-brand"
              : "btn-secondary-brand"
          }
          disabled={buttonDisabled}
          onClick={handleClick}
          style={{
            minWidth: "130px",
            padding: "8px 18px",
            fontSize: "13px",
            opacity: buttonDisabled ? 0.6 : 1,
          }}
        >
          {buttonLabel}
        </button>

      </div>

    </div>
  </div>
);
};

export default ExamCard;