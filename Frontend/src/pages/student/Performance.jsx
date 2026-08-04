import { useEffect, useState } from "react";
import { TrendingUp, BookOpen, Award, Trophy } from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";

import { getStudentExams } from "../../services/studentService";
import { getStudentPerformance } from "../../services/examService";

/** Smooth filled line chart of percentage score across every completed
 *  exam. Pure SVG, no chart library needed. */
const ScoreTrendChart = ({ exams }) => {
  if (!exams || exams.length === 0) {
    return (
      <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: 0 }}>
        No completed exams yet.
      </p>
    );
  }

  const width = 720;
  const height = 220;
  const padLeft = 36;
  const padRight = 20;
  const padTop = 16;
  const padBottom = 28;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const n = exams.length;
  const stepX = n > 1 ? chartW / (n - 1) : 0;

  const points = exams.map((e, i) => {
    const pct = Math.max(0, Math.min(100, e.percentage ?? 0));
    const x = padLeft + (n > 1 ? i * stepX : chartW / 2);
    const y = padTop + chartH - (pct / 100) * chartH;
    return { x, y, pct, title: e.examTitle || "Exam" };
  });

  // Smooth curve through the points via cubic bezier segments.
  const linePath = points.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const midX = (prev.x + p.x) / 2;
    return `${d} C ${midX} ${prev.y}, ${midX} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  const baseline = padTop + chartH;
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`;

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", minWidth: 420, height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="scoreTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((t) => {
          const y = padTop + chartH - (t / 100) * chartH;
          return (
            <g key={t}>
              <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="var(--color-border)" strokeWidth="1" />
              <text x={padLeft - 8} y={y + 3} fontSize="10" fill="var(--color-text-muted)" textAnchor="end">
                {t}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#scoreTrendFill)" stroke="none" />
        <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="var(--color-primary)" strokeWidth="2" />
            <text x={p.x} y={height - 6} fontSize="10" fill="var(--color-text-muted)" textAnchor="middle">
              {p.title.length > 14 ? `${p.title.slice(0, 13)}…` : p.title}
            </text>
          </g>
        ))}
      </svg>
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
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 4 }}>{averageScore}%</div>
                </div>
                <Award size={22} color="var(--color-primary)" />
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className="card" style={{ padding: 18, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Exams Completed</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 4 }}>{totalExams}</div>
                </div>
                <BookOpen size={22} color="var(--color-success)" />
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className="card" style={{ padding: 18, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Best Score</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 4 }}>{bestScore}%</div>
                </div>
                <Trophy size={22} color="var(--color-warning)" />
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

            <ScoreTrendChart exams={performances} />
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