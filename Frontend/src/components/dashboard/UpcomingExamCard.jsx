import { Clock, PlayCircle, FileText } from "lucide-react";

const UpcomingExamCard = ({ exam, onStart }) => {
  const isAvailable = exam.status === "available";

  return (
    <div
      className="card hover-lift"
      style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 14 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        <div className="icon-circle" style={{ background: "#EFF6FF" }}>
          <FileText size={16} color="var(--color-primary)" />
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{exam.title}</div>
          <div style={{ fontSize: 12.5, color: "var(--color-text-secondary)", marginTop: 3 }}>
            {exam.subject} · {exam.duration} min · {exam.totalMarks} marks
          </div>
          <span
            className={`badge-${isAvailable ? "success" : "warning"}`}
            style={{ marginTop: 6, display: "inline-block" }}
          >
            {exam.startTime}
          </span>
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
          <Clock size={14} /> Not yet
        </button>
      )}
    </div>
  );
};

export default UpcomingExamCard;