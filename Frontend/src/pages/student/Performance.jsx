import { useState, useEffect } from "react";
import { getStudentExams } from "../../services/studentService";
import { getStudentPerformance } from "../../services/examService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";

const Bar = ({ label, value }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
      <span style={{ color: "var(--color-text-primary)" }}>{label}</span>
      <span style={{ color: "var(--color-text-secondary)" }}>{value}%</span>
    </div>
    <div style={{ height: 8, background: "var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: "var(--color-primary)" }} />
    </div>
  </div>
);

// Her backend only has GET /api/analytics/student-performance/<exam_id>/ —
// per exam, not an aggregate across every exam a student has taken.
// So this page: 1) gets all exams, 2) filters to completed ones,
// 3) fetches performance for each, 4) shows one card per exam.
const Performance = () => {
  const [examPerformances, setExamPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const exams = await getStudentExams();
        const completed = exams.filter((e) => e.status === "completed");

        const results = await Promise.all(
          completed.map(async (exam) => ({
            exam,
            performance: await getStudentPerformance(exam.id)
          }))
        );

        setExamPerformances(results);
      } catch (err) {
        setLoadError(
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "Could not load performance data."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <DashboardLayout activeItem="Performance"><Loader /></DashboardLayout>;
  }

  if (loadError) {
    return (
      <DashboardLayout activeItem="Performance">
        <div className="card" style={{ padding: 20, color: "#b91c1c" }}>{loadError}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="Performance">
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 20 }}>Performance Analysis</h1>

      {examPerformances.length === 0 && (
        <p style={{ color: "var(--color-text-muted)", fontSize: 13.5 }}>
          No completed exams yet — performance data will appear here once you've taken an exam.
        </p>
      )}

      {examPerformances.map(({ exam, performance }) => (
        <div key={exam.id} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 12 }}>{exam.title}</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14.5, marginBottom: 16 }}>Accuracy by Topic</h3>
              {performance.topicBreakdown.length === 0
                ? <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>No topic data available.</p>
                : performance.topicBreakdown.map((t) => <Bar key={t.topic} label={t.topic} value={t.accuracy} />)}
            </div>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14.5, marginBottom: 16 }}>Accuracy by Difficulty</h3>
              {performance.difficultyBreakdown.length === 0
                ? <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>No difficulty data available.</p>
                : performance.difficultyBreakdown.map((d) => <Bar key={d.level} label={d.level} value={d.accuracy} />)}
            </div>
          </div>
        </div>
      ))}
    </DashboardLayout>
  );
};

export default Performance;