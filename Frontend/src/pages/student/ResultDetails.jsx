import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getExamResult } from "../../services/examService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const ResultDetails = () => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [loadError, setLoadError] = useState("");

  // If the page was opened directly (refresh, shared link) rather than
  // via in-app navigation, location.state won't exist — fetch it for real.
  useEffect(() => {
    if (location.state) return;

    getExamResult(examId)
      .then(setResult)
      .catch((err) => {
        setLoadError(
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "Could not load this result."
        );
      })
      .finally(() => setLoading(false));
  }, [examId, location.state]);

  if (loading) {
    return <DashboardLayout activeItem="Results"><Loader /></DashboardLayout>;
  }

  if (loadError || !result) {
    return (
      <DashboardLayout activeItem="Results">
        <div className="card" style={{ padding: 20, color: "#b91c1c" }}>
          {loadError || "Result not found."}
        </div>
      </DashboardLayout>
    );
  }

  // NOTE: score/total field names are guesses until we see a real
  // GET /api/results/view/<exam_id>/ response — adjust here if different.
  const score = result.score ?? 0;
  const total = result.total ?? result.totalMarks ?? 0;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= 40;

  return (
    <DashboardLayout activeItem="Results">
      <button onClick={() => navigate("/student/results")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", marginBottom: 18 }}>
        <ArrowLeft size={15} /> Back to results
      </button>

      <div className="card" style={{ padding: 32, maxWidth: 480, textAlign: "center" }}>
        <CheckCircle2 size={40} color={passed ? "var(--color-success)" : "var(--color-danger)"} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, margin: "14px 0 4px" }}>
          {passed ? "You Passed!" : "You Didn't Pass"}
        </h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 13.5, marginBottom: 20 }}>
          You scored {score} out of {total} ({percentage}%)
        </p>
        <div style={{ height: 10, background: "var(--color-border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ width: `${percentage}%`, height: "100%", background: passed ? "var(--color-success)" : "var(--color-danger)" }} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResultDetails;