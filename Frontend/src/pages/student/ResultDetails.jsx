import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getExamResult } from "../../services/examService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";

const ResultDetails = () => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [loadError, setLoadError] = useState("");

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

  // The backend returns { message: "..." } instead of real marks when the
  // faculty hasn't published this result yet — treat that as its own
  // state instead of falling through to score=0/total=0, which used to
  // render a full "You Didn't Pass — 0 out of 0" screen right after
  // submitting, before publishing had even happened.
  const isUnpublished = result.message && result.marks === undefined && result.percentage === undefined;

  if (isUnpublished) {
    return (
      <DashboardLayout activeItem="Results">
        <button onClick={() => navigate("/student/results")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", marginBottom: 18 }}>
          <ArrowLeft size={15} /> Back to results
        </button>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div className="card" style={{ padding: 40, maxWidth: 440, width: "100%", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div
                className="icon-circle"
                style={{ width: 56, height: 56, background: "#FFFBEB" }}
              >
                <Clock size={26} color="var(--color-warning)" />
              </div>
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 19, fontWeight: 600, margin: "0 0 8px", color: "var(--color-text-primary)" }}>
              Result Not Published Yet
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
              Your exam has been submitted successfully. Your faculty hasn't published this result yet — check back later.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Real published result: backend's Result model/serializer exposes
  // `marks` and `percentage` directly (already computed server-side),
  // not score/total — matches r.marks / r.percentage seen in the
  // faculty-facing results view.
  const marks = result.marks ?? 0;
  const percentage = result.percentage ?? 0;
  const totalMarks = result.total_marks ?? result.totalMarks ?? result.exam?.total_marks ?? null;
  const passed = percentage >= 40;

  return (
    <DashboardLayout activeItem="Results">
      <button onClick={() => navigate("/student/results")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", marginBottom: 18 }}>
        <ArrowLeft size={15} /> Back to results
      </button>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="card" style={{ padding: 40, maxWidth: 440, width: "100%", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div
              className="icon-circle"
              style={{ width: 56, height: 56, background: passed ? "#ECFDF5" : "#FEF2F2" }}
            >
              <CheckCircle2 size={26} color={passed ? "var(--color-success)" : "var(--color-danger)"} />
            </div>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 600, margin: "0 0 8px", color: "var(--color-text-primary)" }}>
            {passed ? "You Passed!" : "You Didn't Pass"}
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: 13.5, marginBottom: 20 }}>
            {totalMarks !== null
              ? `You scored ${marks} out of ${totalMarks} (${percentage}%)`
              : `You scored ${percentage}%`}
          </p>
          <div style={{ height: 10, background: "var(--color-border)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ width: `${percentage}%`, height: "100%", background: passed ? "var(--color-success)" : "var(--color-danger)" }} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResultDetails;