import { useEffect, useState } from "react";
import { TrendingUp, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getStudentExams } from "../../services/studentService";
import { getStudentPerformance } from "../../services/examService";

const DIFFICULTY_COLORS = {
  easy: "#059669",
  medium: "#D97706",
  hard: "#DC2626",
};

/** Simple horizontal bar chart, no external chart library needed. */
const AccuracyBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
        No difficulty data available for this exam.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {data.map((d) => (
        <div key={d.difficulty}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", textTransform: "capitalize" }}>
              {d.difficulty}
            </span>
            <span style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>
              {d.accuracy !== null ? `${d.accuracy}%` : "\u2014"} ({d.correct}/{d.total})
            </span>
          </div>
          <div style={{ height: 10, background: "var(--color-border)", borderRadius: 10, overflow: "hidden" }}>
            <div
              style={{
                width: `${d.accuracy ?? 0}%`,
                height: "100%",
                background: DIFFICULTY_COLORS[d.difficulty] || "var(--color-primary)",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

/** Bar chart comparing overall percentage score across every completed exam. */
const ScoreTrendChart = ({ exams }) => {
  if (!exams || exams.length === 0) {
    return (
      <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
        No completed exams yet.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 160, paddingTop: 10 }}>
      {exams.map((e) => {
        const pct = e.percentage ?? 0;
        return (
          <div key={e.examId} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11.5, color: "var(--color-text-secondary)", fontWeight: 600 }}>{pct}%</span>
            <div
              style={{
                width: "100%",
                maxWidth: 44,
                height: `${Math.max(pct, 3)}%`,
                background: pct >= 40 ? "var(--color-primary)" : "var(--color-danger)",
                borderRadius: "6px 6px 0 0",
                transition: "height 0.4s ease",
              }}
              title={`${e.examTitle}: ${pct}%`}
            />
            <span
              style={{
                fontSize: 11,
                color: "var(--color-text-muted)",
                textAlign: "center",
                maxWidth: 70,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={e.examTitle}
            >
              {e.examTitle}
            </span>
          </div>
        );
      })}
    </div>
  );
};

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
          completedExams.map((e) =>
            getStudentPerformance(e.id).catch(() => null)
          )
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

  return (
    <DashboardLayout activeItem="Performance">
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 6, color: "var(--color-text-primary)" }}>
        Performance Analysis
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", marginBottom: 24 }}>
        Your accuracy breakdown, by exam and by question difficulty.
      </p>

      {performances.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: 0 }}>
            No performance data yet - this shows up once at least one of your exam results has been published.
          </p>
        </div>
      ) : (
        <>
          <div className="card" style={{ padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <TrendingUp size={16} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: "var(--color-text-primary)" }}>
                Score Trend Across Exams
              </h3>
            </div>
            <ScoreTrendChart exams={performances} />
          </div>

          {performances.map((p) => (
            <div key={p.examId} className="card" style={{ padding: 20, marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)" }}>
                {p.examTitle}
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "var(--color-text-secondary)" }}>
                Overall: {p.marks ?? "\u2014"} marks ({p.percentage ?? 0}%)
              </p>

              <AccuracyBarChart data={p.difficultyBreakdown} />

              {p.weakAreas.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 12.5, color: "var(--color-warning)" }}>
                  <AlertTriangle size={13} />
                  Weak areas: {p.weakAreas.map((w) => w[0].toUpperCase() + w.slice(1)).join(", ")}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </DashboardLayout>
  );
};

export default Performance;