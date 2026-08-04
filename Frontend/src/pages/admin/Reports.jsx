import { useEffect, useState } from "react";
import {
  FileText, Users, AlertTriangle, ShieldCheck,
  BarChart3, TrendingUp, ListChecks
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import {
  getAllExams,
  getFlaggedAlerts,
  getDashboardStats,
  getExamAnalytics,
} from "../../services/adminService";

const VIOLATION_COLORS = {
  face_missing: "#DC2626",
  multiple_faces: "#D97706",
  tab_switch: "#2563EB",
};

const riskLevel = (count) => {
  if (count >= 6) return { label: "High", color: "#DC2626", bg: "#FEF2F2" };
  if (count >= 4) return { label: "Medium", color: "#D97706", bg: "#FFFBEB" };
  return { label: "Low", color: "#059669", bg: "#ECFDF5" };
};

/** Smooth filled line chart — same visual language as the student
 *  Performance page's ScoreTrendChart, reused here for exam volume. */
const TrendChart = ({ data, valueKey, labelKey, color = "#2563EB", gradientId }) => {
  if (!data || data.length === 0) {
    return (
      <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: 0 }}>
        Not enough data yet.
      </p>
    );
  }

  const width = 640;
  const height = 200;
  const padLeft = 34;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 28;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const n = data.length;
  const stepX = n > 1 ? chartW / (n - 1) : 0;
  const maxVal = Math.max(1, ...data.map((d) => d[valueKey]));

  const points = data.map((d, i) => {
    const val = d[valueKey];
    const x = padLeft + (n > 1 ? i * stepX : chartW / 2);
    const y = padTop + chartH - (val / maxVal) * chartH;
    return { x, y, val, label: d[labelKey] };
  });

  const linePath = points.reduce((path, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const midX = (prev.x + p.x) / 2;
    return `${path} C ${midX} ${prev.y}, ${midX} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  const baseline = padTop + chartH;
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`;

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", minWidth: 380, height: "auto", display: "block" }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.20" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((t) => {
          const y = padTop + chartH - t * chartH;
          return <line key={t} x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="var(--color-border)" strokeWidth="1" />;
        })}

        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke={color} strokeWidth="2" />
            <text x={p.x} y={p.y - 10} fontSize="10.5" fontWeight="700" fill="var(--color-text-primary)" textAnchor="middle">
              {p.val}
            </text>
            <text x={p.x} y={height - 6} fontSize="10" fill="var(--color-text-muted)" textAnchor="middle">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

/** Horizontal bar row, shared by AI Violations + Faculty Load — kept
 *  consistent so both sections read the same way at a glance. */
const BarRow = ({ label, count, max, color }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
      <span style={{ color: "var(--color-text-secondary)", textTransform: "capitalize" }}>{label}</span>
      <span style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>{count}</span>
    </div>
    <div style={{ height: 8, borderRadius: 6, background: "#F1F5F9", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(count / max) * 100}%`, background: color, borderRadius: 6, transition: "width 0.3s ease" }} />
    </div>
  </div>
);

const SectionHeader = ({ icon, title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
    {icon}
    <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: "var(--color-text-primary)" }}>{title}</h3>
  </div>
);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [dashStats, setDashStats] = useState(null);
  const [examSummaries, setExamSummaries] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [examList, alertsList, stats] = await Promise.all([
        getAllExams(),
        getFlaggedAlerts(),
        getDashboardStats(),
      ]);
      setExams(examList);
      setAlerts(alertsList);
      setDashStats(stats);

      const analyticsResults = await Promise.all(
        examList.map((e) =>
          getExamAnalytics(e.id)
            .then((data) => (data ? { ...e, analytics: data } : null))
            .catch(() => null)
        )
      );
      setExamSummaries(analyticsResults.filter(Boolean));
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeItem="Reports">
        <Loader label="Building your analytics dashboard..." />
      </DashboardLayout>
    );
  }

  const totalStudents = dashStats?.totalStudents ?? 0;
  const totalExams = exams.length;
  const totalAlerts = alerts.length;

  const avgScore =
    examSummaries.length > 0
      ? (
          examSummaries.reduce((sum, e) => sum + (e.analytics.average_percentage || 0), 0) /
          examSummaries.length
        ).toFixed(1)
      : null;

  const violationCounts = {};
  alerts.forEach((a) => {
    a.warnings.forEach((w) => {
      violationCounts[w.type] = (violationCounts[w.type] || 0) + 1;
    });
  });
  const violationEntries = Object.entries(violationCounts).sort((a, b) => b[1] - a[1]);
  const maxViolation = Math.max(1, ...violationEntries.map(([, c]) => c));

  const facultyCounts = {};
  exams.forEach((e) => {
    const name = e.facultyName || "Unknown";
    facultyCounts[name] = (facultyCounts[name] || 0) + 1;
  });
  const facultyEntries = Object.entries(facultyCounts).sort((a, b) => b[1] - a[1]);
  const maxFacultyCount = Math.max(1, ...facultyEntries.map(([, c]) => c));

  const monthCounts = {};
  exams.forEach((e) => {
    if (!e.startTime) return;
    const d = new Date(e.startTime);
    if (isNaN(d)) return;
    const key = d.toLocaleString(undefined, { month: "short", year: "2-digit" });
    monthCounts[key] = (monthCounts[key] || 0) + 1;
  });
  const monthTrendData = Object.entries(monthCounts).map(([month, count]) => ({ month, count }));

  const highRisk = [...alerts].sort((a, b) => b.warning_count - a.warning_count).slice(0, 8);

  const integrityScore =
    totalStudents > 0
      ? Math.max(0, Math.round(100 - (totalAlerts / totalStudents) * 100))
      : 100;
  const integrityColor =
    integrityScore >= 80 ? "#059669" : integrityScore >= 50 ? "#D97706" : "#DC2626";

  const examsAbovePassing = examSummaries.filter((e) => e.analytics.average_percentage >= 40).length;
  const passRatePct =
    examSummaries.length > 0 ? Math.round((examsAbovePassing / examSummaries.length) * 100) : 0;

  const cardStyle = { padding: 20, height: "100%" };

  return (
    <DashboardLayout activeItem="Reports">
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 6, color: "var(--color-text-primary)" }}>
        Reports Dashboard
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", marginBottom: 24 }}>
        A live overview of exam activity, student performance, and AI-detected proctoring violations.
      </p>

  {/* KPI row */}
<div className="row g-3 mb-4">
  {[
    { label: "Total Exams", value: totalExams, icon: <FileText size={22} color="var(--color-primary)" /> },
    { label: "Total Students", value: totalStudents, icon: <Users size={22} color="var(--color-success)" /> },
    { label: "Avg Exam Score", value: avgScore !== null ? `${avgScore}%` : "—", icon: <BarChart3 size={22} color="var(--color-accent)" /> },
    { label: "AI Alerts", value: totalAlerts, icon: <AlertTriangle size={22} color="var(--color-danger)" /> },
  ].map((kpi) => (
    <div key={kpi.label} className="col-6 col-xl-3">
      <div
        className="card"
        style={{
          padding: 18,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{kpi.label}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 4 }}>{kpi.value}</div>
        </div>
        {kpi.icon}
      </div>
    </div>
  ))}
</div>

      <div className="row g-3 mb-4 align-items-stretch">
        <div className="col-12 col-lg-6">
          <div className="card" style={cardStyle}>
            <SectionHeader icon={<AlertTriangle size={16} color="var(--color-danger)" />} title="AI Violations by Type" />
            {violationEntries.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>No violations recorded yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {violationEntries.map(([type, count]) => (
                  <BarRow
                    key={type}
                    label={type.replace(/_/g, " ")}
                    count={count}
                    max={maxViolation}
                    color={VIOLATION_COLORS[type] || "var(--color-primary)"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card" style={cardStyle}>
            <SectionHeader icon={<ShieldCheck size={16} color="var(--color-primary)" />} title="Overall Integrity Score" />
            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <div
                style={{
                  width: 110, height: 110, borderRadius: "50%",
                  background: `conic-gradient(${integrityColor} ${integrityScore * 3.6}deg, #F1F5F9 0deg)`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <div style={{ width: 82, height: 82, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: integrityColor }}>{integrityScore}%</span>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 160 }}>
                <p style={{ fontSize: 12.5, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
                  Based on flagged students relative to total student count. Higher is healthier.
                </p>
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>Exams above passing average</span>
                    <span style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>{passRatePct}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 6, background: "#F1F5F9", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${passRatePct}%`, background: "var(--color-success)", borderRadius: 6 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4 align-items-stretch">
        <div className="col-12 col-lg-6">
          <div className="card" style={cardStyle}>
            <SectionHeader icon={<ListChecks size={16} color="var(--color-primary)" />} title="Faculty Exam Load" />
            {facultyEntries.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>No exams created yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {facultyEntries.map(([name, count]) => (
                  <BarRow key={name} label={name} count={count} max={maxFacultyCount} color="var(--color-accent)" />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card" style={cardStyle}>
            <SectionHeader icon={<TrendingUp size={16} color="var(--color-primary)" />} title="Monthly Exam Volume" />
            <TrendChart data={monthTrendData} valueKey="count" labelKey="month" color="#2563EB" gradientId="monthlyVolumeFill" />
          </div>
        </div>
      </div>

      {/* High risk students */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16, color: "var(--color-text-primary)" }}>
          High-Risk Students
        </h3>

        {highRisk.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", padding: "10px 0" }}>No flagged students currently.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  {["Student", "Exam", "Warnings", "Risk"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {highRisk.map((a) => {
                  const risk = riskLevel(a.warning_count);
                  return (
                    <tr key={`${a.student_id}-${a.exam_id}`} className="row-hover" style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "12px 14px", fontSize: 13.5, fontWeight: 500, color: "var(--color-text-primary)" }}>{a.student_name}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>{a.exam_title}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>{a.warning_count}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ background: risk.bg, color: risk.color, fontWeight: 600, padding: "4px 12px", borderRadius: 8, fontSize: 12 }}>
                          {risk.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Exam summary table */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16, color: "var(--color-text-primary)" }}>
          Exam Performance Summary
        </h3>

        {examSummaries.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", padding: "10px 0" }}>No exams have results yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  {["Exam", "Students", "Avg Marks", "Highest", "Lowest", "Avg %"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {examSummaries.map((e) => (
                  <tr key={e.id} className="row-hover" style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "12px 14px", fontSize: 13.5, fontWeight: 500, color: "var(--color-text-primary)" }}>{e.title}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>{e.analytics.total_students}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>{e.analytics.average_marks}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>{e.analytics.highest_marks}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>{e.analytics.lowest_marks}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>{e.analytics.average_percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;