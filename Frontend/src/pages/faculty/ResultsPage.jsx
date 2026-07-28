import { useState, useEffect } from "react";
import { Users, FileText, CheckCircle2, XCircle, Send, CheckCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getFacultyResultsData, publishResult, publishAllResults } from "../../services/resultsService";
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
  const [examFilter, setExamFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [publishingId, setPublishingId] = useState(null);
  const [publishingExamId, setPublishingExamId] = useState(null);
  const [actionError, setActionError] = useState("");

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

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  const handlePublishOne = async (resultId) => {
    setActionError("");
    setPublishingId(resultId);
    try {
      await publishResult(resultId);
      setResults((prev) =>
        prev.map((r) => (r.id === resultId ? { ...r, isPublished: true } : r))
      );
    } catch (err) {
      setActionError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Could not publish this result. Please try again."
      );
    } finally {
      setPublishingId(null);
    }
  };

  const handlePublishAll = async (examId) => {
    setActionError("");
    setPublishingExamId(examId);
    try {
      await publishAllResults(examId);
      setResults((prev) =>
        prev.map((r) => (r.examId === examId ? { ...r, isPublished: true } : r))
      );
    } catch (err) {
      setActionError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Could not publish results for this exam. Please try again."
      );
    } finally {
      setPublishingExamId(null);
    }
  };

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
  const exams = ["all", ...new Set(results.map((r) => JSON.stringify({ id: r.examId, title: r.exam })))]
    .map((s, i) => (i === 0 ? { id: "all", title: "All Exams" } : JSON.parse(s)));

  const filteredResults = results.filter((r) => {
    const matchesStudent = studentFilter === "all" || r.student === studentFilter;
    const matchesResult = resultFilter === "all" || r.result === resultFilter;
    const matchesExam = examFilter === "all" || String(r.examId) === String(examFilter);
    return matchesStudent && matchesResult && matchesExam;
  });

  // Only offer "Publish All" when a single exam is selected, and only
  // if it actually has unpublished results left.
  const currentExamHasUnpublished =
    examFilter !== "all" && filteredResults.some((r) => !r.isPublished);

  return (
    <DashboardLayout activeItem="Results">
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 6, color: "var(--color-text-primary)" }}>
        Results
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", marginBottom: 20 }}>
        Student performance across all your exams. Results stay hidden from students until you publish them.
      </p>

      <div className="row g-3 mb-4">
        {statCards.map((c) => (
          <div key={c.label} className="col-6 col-md-3">
            <StatisticsCard {...c} />
          </div>
        ))}
      </div>

      {actionError && (
        <div className="card" style={{ padding: "12px 16px", marginBottom: 16, background: "#FEF2F2", color: "#B91C1C", fontSize: 13 }}>
          {actionError}
        </div>
      )}

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 17, margin: 0, color: "var(--color-text-primary)" }}>
            All Results
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select
              style={{ height: 38, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 10px", fontSize: 13 }}
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.title}</option>
              ))}
            </select>
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

            {currentExamHasUnpublished && (
              <button
                className="btn-primary-brand d-flex align-items-center gap-2"
                disabled={publishingExamId === examFilter}
                onClick={() => handlePublishAll(examFilter)}
              >
                <CheckCheck size={14} />
                {publishingExamId === examFilter ? "Publishing..." : "Publish All (this exam)"}
              </button>
            )}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["Student", "Exam", "Date", "Result", "Score", "Time Spent", "Status", ""].map((h) => (
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
                  <td style={{ padding: "12px 14px" }}>
                    <span className={r.isPublished ? "badge-success" : "badge-warning"}>
                      {r.isPublished ? "Published" : "Unpublished"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    {!r.isPublished && (
                      <button
                        className="btn-secondary-brand d-flex align-items-center gap-2"
                        disabled={publishingId === r.id}
                        onClick={() => handlePublishOne(r.id)}
                      >
                        <Send size={13} />
                        {publishingId === r.id ? "Publishing..." : "Publish"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 20, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>
                    No results match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResultsPage;