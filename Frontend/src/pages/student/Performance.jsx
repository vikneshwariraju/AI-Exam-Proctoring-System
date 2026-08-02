import { useEffect, useState } from "react";
import { TrendingUp, BookOpen, Award, Trophy } from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";

import { getStudentExams } from "../../services/studentService";
import { getStudentPerformance } from "../../services/examService";

const Performance = () => {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const exams = await getStudentExams();
        const completedExams = exams.filter((e) => e.status === "completed");

        const results = await Promise.all(
          completedExams.map((e) => getStudentPerformance(e.id).catch(() => null))
        );

        setPerformances(results.filter(Boolean));
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
    return (
      <DashboardLayout activeItem="Performance">
        <Loader label="Loading performance data..." />
      </DashboardLayout>
    );
  }

  if (loadError) {
    return (
      <DashboardLayout activeItem="Performance">
        <div className="card" style={{ padding: 20, color: "#b91c1c" }}>{loadError}</div>
      </DashboardLayout>
    );
  }

  const totalExams = performances.length;

  const averageScore =
    totalExams > 0
      ? (performances.reduce((sum, p) => sum + (p.percentage || 0), 0) / totalExams).toFixed(1)
      : 0;

  const bestScore =
    totalExams > 0 ? Math.max(...performances.map((p) => p.percentage || 0)) : 0;

  return (
    <DashboardLayout activeItem="Performance">
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 6, color: "var(--color-text-primary)" }}>
        Performance Analysis
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", marginBottom: 24 }}>
        Track your progress across every exam you've completed.
      </p>

      {performances.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <BookOpen size={36} color="var(--color-primary)" style={{ marginBottom: 12 }} />
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, margin: "0 0 6px", color: "var(--color-text-primary)" }}>
            No Performance Data Yet
          </h3>
          <p style={{ fontSize: 13.5, color: "var(--color-text-muted)", margin: 0 }}>
            Complete an exam to see your performance analysis here.
          </p>
        </div>
      ) : (
        <>
          {/* Summary row */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-4">
              <div className="card" style={{ padding: 18, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Average Score</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 4 }}>{averageScore}%</div>
                </div>
                <Award size={30} color="var(--color-primary)" />
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className="card" style={{ padding: 18, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Exams Completed</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 4 }}>{totalExams}</div>
                </div>
                <BookOpen size={30} color="var(--color-success)" />
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className="card" style={{ padding: 18, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Best Score</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 4 }}>{bestScore}%</div>
                </div>
                <Trophy size={30} color="var(--color-warning)" />
              </div>
            </div>
          </div>

          {/* Score trend */}
          <div className="card" style={{ padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <TrendingUp size={16} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: "var(--color-text-primary)" }}>
                Score Trend
              </h3>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: 160, overflowX: "auto" }}>
              {performances.map((p) => {
                const pct = p.percentage ?? 0;
                return (
                  <div key={p.examId} style={{ flex: "0 0 60px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-primary)" }}>{pct}%</span>
                    <div
                      style={{
                        width: 36,
                        height: `${Math.max(pct, 4)}%`,
                        background: pct >= 40 ? "var(--color-primary)" : "var(--color-danger)",
                        borderRadius: "6px 6px 2px 2px",
                      }}
                    />
                    <span
                      style={{ fontSize: 11, color: "var(--color-text-muted)", maxWidth: 60, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      title={p.examTitle}
                    >
                      {p.examTitle}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-exam results */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14.5, fontWeight: 600, color: "var(--color-text-primary)" }}>
              Exam Results
            </h3>

            {performances.map((p) => {
              const pct = p.percentage ?? 0;
              const passed = pct >= 40;
              return (
                <div
                  key={p.examId}
                  className="row-hover"
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 8px", borderBottom: "1px solid var(--color-border)" }}
                >
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--color-text-primary)" }}>{p.examTitle}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>Marks: {p.marks ?? "\u2014"}</div>
                  </div>
                  <span className={passed ? "badge-success" : "badge-danger"}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Performance;