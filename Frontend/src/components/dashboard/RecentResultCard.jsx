import { Eye, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentResultCard = ({ results = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 14.5, fontWeight: 600, color: "var(--color-text-primary)" }}>
        Recent Results
      </h3>

      {results.length === 0 && (
        <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>No completed exams yet.</p>
      )}

      {results.map((r) => {
        const passed = (r.percentage ?? 0) >= 40;

        return (
          <div
            key={r.id}
            className="row-hover"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px", borderBottom: "1px solid var(--color-border)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <div
                className="icon-circle"
                style={{ background: passed ? "#ECFDF5" : "#FEF2F2", width: 32, height: 32 }}
              >
                <Award size={14} color={passed ? "var(--color-success)" : "var(--color-danger)"} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{r.title}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
                  Score: {r.score ?? "-"}{r.totalMarks ? `/${r.totalMarks}` : ""}
                </div>
              </div>
            </div>

            <Eye
              size={15}
              style={{ cursor: "pointer", color: "var(--color-primary)", flexShrink: 0 }}
              onClick={() => navigate(`/student/results/${r.id}`)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RecentResultCard;