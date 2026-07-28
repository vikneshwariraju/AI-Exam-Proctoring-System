import { useState, useEffect } from "react";
import { FileText, HelpCircle, CalendarClock, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getFacultyStats, getFacultyExams } from "../../services/facultyService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import StatisticsCard from "../../components/dashboard/StatisticsCard";
import Loader from "../../components/common/Loader";
import "../../styles/dashboard.css";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, examsData] = await Promise.all([
          getFacultyStats(user?.user_id),
          getFacultyExams(user?.user_id),
        ]);
        setStats(statsData);
        setExams(examsData);
      } catch (err) {
        setLoadError(
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "Could not load faculty dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.user_id]);

  if (loading) {
    return (
      <DashboardLayout activeItem="Dashboard">
        <Loader label="Loading faculty dashboard..." />
      </DashboardLayout>
    );
  }

  if (loadError) {
    return (
      <DashboardLayout activeItem="Dashboard">
        <div className="card" style={{ padding: 20, color: "#b91c1c" }}>{loadError}</div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: "Total Exams", value: stats.totalExams, icon: <FileText size={17} color="#7C3AED" />, bg: "#F3E8FF" },
    { label: "Total Questions", value: stats.totalQuestions, icon: <HelpCircle size={17} color="#4338CA" />, bg: "#E0E7FF" },
    { label: "Upcoming Exams", value: stats.upcomingExams, icon: <CalendarClock size={17} color="#0D9488" />, bg: "#CCFBF1" },
  ];

  return (
    <DashboardLayout activeItem="Dashboard">
      <WelcomeCard name={user?.name} />

      {stats.showingAllExams && (
        <div className="card" style={{ padding: "12px 16px", marginBottom: 20, background: "#FFFBEB", borderColor: "#FDE68A", fontSize: 13, color: "#92400E" }}>
          The exam list below shows <b>all exams from every faculty member</b> — her backend's exam data
          doesn't currently include a "created by" field to filter to just your own exams. Worth asking
          her to add a <code>created_by</code> field on the Exam model if you need per-faculty scoping.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {statCards.map((c) => <StatisticsCard key={c.label} {...c} />)}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 17, margin: 0, color: "var(--color-text-primary)" }}>
            My Exams
          </h2>
          <button
            className="btn-primary-brand d-flex align-items-center gap-2"
            onClick={() => navigate("/faculty/exams/create")}
          >
            <Plus size={15} /> Create New Exam
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              {["Title", "Subject", "Duration", "Total Marks", "Questions", "Status", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id} className="row-hover" style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "12px 14px", fontSize: 13.5 }}>{exam.title}</td>
                <td style={{ padding: "12px 14px", fontSize: 13.5 }}>{exam.subject || "-"}</td>
                <td style={{ padding: "12px 14px", fontSize: 13.5 }}>{exam.duration} min</td>
                <td style={{ padding: "12px 14px", fontSize: 13.5 }}>{exam.totalMarks}</td>
                <td style={{ padding: "12px 14px", fontSize: 13.5 }}>{exam.questionCount}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span className={`badge-${exam.status === "draft" ? "warning" : "success"}`}>
                    {exam.status}
                  </span>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <button
                    className="btn-secondary-brand d-flex align-items-center gap-2"
                    onClick={() => navigate(`/faculty/exams/${exam.id}/questions`)}
                  >
                    <Eye size={14} /> View Questions
                  </button>
                </td>
              </tr>
            ))}
            {exams.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 20, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>
                  No exams created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;