import { useState, useEffect } from "react";
import { FileText, HelpCircle, CalendarClock, Plus, Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getFacultyStats, getFacultyExams } from "../../services/facultyService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatisticsCard from "../../components/dashboard/StatisticsCard";
import Loader from "../../components/common/Loader";
import "../../styles/dashboard.css";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
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
    { label: "Total Exams", value: stats.totalExams, icon: <FileText size={17} /> },
    { label: "Total Questions", value: stats.totalQuestions, icon: <HelpCircle size={17} /> },
    { label: "Upcoming Exams", value: stats.upcomingExams, icon: <CalendarClock size={17} /> },
  ];

  const filteredExams = exams.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    (e.subject || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout activeItem="Dashboard">

      {stats.showingAllExams && (
        <div className="card" style={{ padding: "12px 16px", marginBottom: 20, background: "#FFFBEB", borderColor: "#FDE68A", fontSize: 13, color: "#92400E" }}>
          The exam list below shows <b>all exams from every faculty member</b> — her backend's exam data
          doesn't currently include a "created by" field to filter to just your own exams.
        </div>
      )}

      <div className="row g-3 mb-4">
        {statCards.map((c) => (
          <div key={c.label} className="col-6 col-md-4">
            <StatisticsCard {...c} />
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 17, margin: 0, color: "var(--color-text-primary)" }}>
            My Exams
          </h2>

          <div className="d-flex align-items-center gap-2" style={{ flexWrap: "wrap" }}>
            <div className="position-relative" style={{ width: 220, maxWidth: "100%" }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: 11, color: "#94A3B8" }} />
              <input
                type="text"
                placeholder="Search exams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", height: 36, borderRadius: 10, border: "1px solid var(--color-border)",
                  paddingLeft: 34, paddingRight: 12, fontSize: 13
                }}
              />
            </div>
            <button
              className="btn-primary-brand d-flex align-items-center gap-2"
              onClick={() => navigate("/faculty/exams/create")}
            >
              <Plus size={15} /> Create New Exam
            </button>
          
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
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
              {filteredExams.map((exam) => (
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
              {filteredExams.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 20, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>
                    {exams.length === 0 ? "No exams created yet." : "No exams match your search."}
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

export default FacultyDashboard;