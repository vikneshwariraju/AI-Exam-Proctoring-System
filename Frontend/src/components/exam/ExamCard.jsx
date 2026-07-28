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
    <div className="card hover-lift" style={{ padding: 20, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 600, color: "var(--color-text-primary)" }}>{exam.title}</h3>
          <span className={badge.className}>{badge.text}</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "6px 0 0", maxWidth: 480 }}>
          {exam.subject} · {exam.duration} min · {exam.totalMarks} marks
        </p>
      </div>

      <button
        className={isAvailable || isCompleted ? "btn-primary-brand" : "btn-secondary-brand"}
        disabled={buttonDisabled}
        style={{ opacity: buttonDisabled ? 0.6 : 1, cursor: buttonDisabled ? "not-allowed" : "pointer", flexShrink: 0 }}
        onClick={handleClick}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default ExamCard;