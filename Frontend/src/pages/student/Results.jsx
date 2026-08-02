import { useState, useEffect } from "react";
import { getStudentExams } from "../../services/studentService";
import { getExamResult } from "../../services/examService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

// getStudentExams() only returns exam metadata (title, duration, status...)
// — no score/percentage. Those live on GET /results/view/<exam_id>/, so for
// every completed exam we fetch its result separately and merge it in.
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

        const withResults = await Promise.all(
          completed.map(async (exam) => {
            const result = await getExamResult(exam.id).catch(() => null);

            // Backend returns { message: "..." } instead of marks/percentage
            // when the faculty hasn't published this result yet.
            const isPublished =
              result && result.marks !== undefined && result.percentage !== undefined;

            return {
              ...exam,
              score: isPublished ? result.marks : undefined,
              percentage: isPublished ? result.percentage : undefined,
              isPublished,
            };
          })
        );

        setResults(withResults);
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
                  <td style={{ padding: "14px 16px", fontSize: 13.5 }}>
                    {r.isPublished ? `${r.score}${r.totalMarks ? `/${r.totalMarks}` : ""}` : (
                      <span className="badge-warning">Not published</span>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {r.isPublished ? (
                      <span className={`badge ${(r.percentage ?? 0) >= 40 ? "badge-success" : "badge-danger"}`}>
                        {r.percentage}%
                      </span>
                    ) : (
                      <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>—</span>
                    )}
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