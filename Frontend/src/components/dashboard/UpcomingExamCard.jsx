import { Clock, PlayCircle, FileText } from "lucide-react";

// Same badge/date-formatting pattern as ExamCard.jsx (Available Exams page)
// for a consistent look across the app.
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

const UpcomingExamCard = ({ exam, onStart }) => {
  const isAvailable = exam.status === "available";

  const badge = isAvailable
    ? { text: "Available", className: "badge-success" }
    : { text: "Upcoming", className: "badge-warning" };

  return (
    <div
      className="card hover-lift"
      style={{
        padding: 20,
        marginBottom: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        <div className="icon-circle" style={{ background: "#EFF6FF", flexShrink: 0 }}>
          <FileText size={16} color="var(--color-primary)" />
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 600, color: "var(--color-text-primary)" }}>
              {exam.title}
            </h3>
            <span className={badge.className}>{badge.text}</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "6px 0 0" }}>
            {exam.subject} · {exam.duration} min · {exam.totalMarks} marks
          </p>
        </div>
      </div>

      {isAvailable ? (
        <button
          className="btn-primary-brand d-flex align-items-center gap-2 flex-shrink-0"
          onClick={() => onStart(exam)}
        >
          <PlayCircle size={14} /> Start
        </button>
      ) : (
        <button
          className="btn-secondary-brand d-flex align-items-center gap-2 flex-shrink-0"
          disabled
          style={{ opacity: 0.6, cursor: "not-allowed" }}
        >
          <Clock size={14} /> Starts {formatDateTime(exam.startTime)}
        </button>
      )}
    </div>
  );
};

export default UpcomingExamCard;