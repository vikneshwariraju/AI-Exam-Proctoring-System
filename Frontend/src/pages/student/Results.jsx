import { useState, useEffect } from "react";
import { getStudentExams } from "../../services/studentService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

// No dedicated "list all my results" endpoint exists on the backend —
// getStudentExams() already fetches every exam and checks each one for
// a result (GET /api/results/view/<exam_id>/), so we just filter to
// the completed ones here instead of calling a separate endpoint.
const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const exams = await getStudentExams();
        const completed = exams.filter((e) => e.status === "completed");
        setResults(completed);
      } catch (err) {
        setLoadError(
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "Could not load results."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loadError) {
    return (
      <DashboardLayout activeItem="Results">
        <div className="card" style={{ padding: 20, color: "#b91c1c" }}>{loadError}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="Results">
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 18 }}>My Results</h1>

      {loading ? <Loader /> : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["Exam", "Score", "Percentage", ""].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "14px 16px", fontSize: 13.5 }}>{r.title}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13.5 }}>{r.score ?? "-"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span className={`badge ${(r.percentage ?? 0) >= 40 ? "badge-success" : "badge-danger"}`}>
                      {r.percentage != null ? `${r.percentage}%` : "-"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <Eye size={15} style={{ cursor: "pointer", color: "var(--color-primary)" }} onClick={() => navigate(`/student/results/${r.id}`)} />
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 20, textAlign: "center", color: "var(--color-text-muted)" }}>No results yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Results;