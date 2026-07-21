import { useNavigate } from "react-router-dom";

const ExamCard = ({ exam }) => {
  const navigate = useNavigate();
  const isAvailable = exam.status === "available";

  return (
    <div className="card" style={{ padding: 20, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 600, color: "var(--color-text-primary)" }}>{exam.title}</h3>
          {isAvailable && <span className="badge badge-success">Available</span>}
        </div>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "6px 0 0", maxWidth: 480 }}>
          {exam.subject} · {exam.duration} min · {exam.totalMarks} marks
        </p>
      </div>

      <button
        className="btn-primary"
        disabled={!isAvailable}
        style={{ opacity: isAvailable ? 1 : 0.5, cursor: isAvailable ? "pointer" : "not-allowed" }}
        onClick={() => navigate(`/student/exams/${exam.id}/instructions`)}
      >
        {isAvailable ? "View Exam" : exam.startTime}
      </button>
    </div>
  );
};

export default ExamCard;