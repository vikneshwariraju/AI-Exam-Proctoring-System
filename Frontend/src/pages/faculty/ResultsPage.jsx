import { useState, useEffect } from "react";
import { Users, FileText, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getFacultyResultsData } from "../../services/resultsService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatisticsCard from "../../components/dashboard/StatisticsCard";
import Loader from "../../components/common/Loader";
import "../../styles/dashboard.css";

const ResultsPage = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [studentFilter, setStudentFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const { stats: statsData, results: resultsData } = await getFacultyResultsData(user?.user_id);
        setStats(statsData);
        setResults(resultsData);
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
    loadData();
  }, [user?.user_id]);

  if (loading) {
    return (
      <DashboardLayout activeItem="Results">
        <Loader label="Loading results..." />
      </DashboardLayout>
    );
  }

  if (loadError) {
    return (
      <DashboardLayout activeItem="Results">
        <div className="card" style={{ padding: 20, color: "#b91c1c" }}>{loadError}</div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: "Students", value: stats.totalStudents, icon: <Users size={17} color="#4338CA" />, bg: "#E0E7FF" },
    { label: "Exams", value: stats.totalExams, icon: <FileText size={17} color="#7C3AED" />, bg: "#F3E8FF" },
    { label: "Passed", value: stats.passedCount, icon: <CheckCircle2 size={17} color="#0D9488" />, bg: "#CCFBF1" },
    { label: "Failed", value: stats.failedCount, icon: <XCircle size={17} color="#DC2626" />, bg: "#FEE2E2" },
  ];

  const students = ["all", ...new Set(results.map((r) => r.student))];

  const filteredResults = results.filter((r) => {
    const matchesStudent = studentFilter === "all" || r.student === studentFilter;
    const matchesResult = resultFilter === "all" || r.result === resultFilter;
    return matchesStudent && matchesResult;
  });

  return (
    <DashboardLayout activeItem="Results">
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 6, color: "var(--color-text-primary)" }}>
        Results
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", marginBottom: 20 }}>
        Student performance across all your exams.
      </p>

      {results.length === 0 && (
        <div className="card" style={{ padding: "12px 16px", marginBottom: 20, background: "#FFFBEB", borderColor: "#FDE68A", fontSize: 13, color: "#92400E" }}>
          No results found — this relies on <code>GET /api/analytics/exam-analytics/&lt;exam_id&gt;/</code> returning
          per-student data. If this stays empty after exams have been taken, confirm that endpoint's real response
          shape with your friend so the field mapping here can be corrected.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {statCards.map((c) => <StatisticsCard key={c.label} {...c} />)}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 17, margin: 0, color: "var(--color-text-primary)" }}>
            All Results
          </h2>
          <div style={{ display: "flex", gap: 10 }}>
            <select
              style={{ height: 38, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 10px", fontSize: 13 }}
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
            >
              {students.map((s) => (
                <option key={s} value={s}>{s === "all" ? "All Students" : s}</option>
              ))}
            </select>
            <select
              style={{ height: 38, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 10px", fontSize: 13 }}
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
            >
              <option value="all">All Results</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              {["Student", "Exam", "Date", "Result", "Score", "Time Spent"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((r) => (
              <tr key={r.id} className="row-hover" style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "12px 14px", fontSize: 13.5 }}>{r.student}</td>
                <td style={{ padding: "12px 14px", fontSize: 13.5 }}>{r.exam}</td>
                <td style={{ padding: "12px 14px", fontSize: 13.5 }}>{r.date}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span className={`badge-${r.result === "passed" ? "success" : "danger"}`}>
                    {r.result === "passed" ? "Passed" : "Failed"}
                  </span>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13.5 }}>{r.score}</td>
                <td style={{ padding: "12px 14px", fontSize: 13.5 }}>{r.timeSpent}</td>
              </tr>
            ))}
            {filteredResults.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>
                  No results match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ResultsPage;