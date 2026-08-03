import { useState, useEffect } from "react";
import { FileText, ListChecks, CalendarClock, Plus, Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentStats, getStudentExams } from "../../services/studentService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import StatisticsCard from "../../components/dashboard/StatisticsCard";
import UpcomingExamCard from "../../components/dashboard/UpcomingExamCard";
import ExamCalendar from "../../components/dashboard/ExamCalendar";
import Loader from "../../components/common/Loader";

const StudentDashboardPage = () => {
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
          getStudentStats(),
          getStudentExams(),
        ]);
        setStats(statsData);
        setExams(examsData);
      } catch (err) {
        setLoadError(
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "Could not load dashboard data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout activeItem="Dashboard">
        <Loader label="Loading your dashboard..." />
      </DashboardLayout>
    );
  }

  if (loadError) {
    return (
      <DashboardLayout activeItem="Dashboard">
        <div className="card" style={{ padding: 20, color: "#b91c1c" }}>
          {loadError}
        </div>
      </DashboardLayout>
    );
  }

  const upcoming = exams.filter((e) => e.status !== "completed");

 
const statCards = [
  {
    label: "Total Exams",
    value: stats.totalExams,
    icon: <FileText size={30} color="var(--color-primary)" />,
  },
  {
    label: "Completed",
    value: stats.completedExams,
    icon: <ListChecks size={30} color="var(--color-success)" />,
  },
  {
    label: "Average Score",
    value: `${stats.averageScore}%`,
    icon: <CalendarClock size={30} color="var(--color-warning)" />,
  },
];

  return (
    <DashboardLayout activeItem="Dashboard">
      <div className="row g-3 mb-4">
        {statCards.map((c) => (
          <div key={c.label} className="col-6 col-md-4">
            <StatisticsCard {...c} />
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 12px", color: "var(--color-text-primary)" }}>
            Upcoming &amp; Available Exams
          </h3>
          {upcoming.length === 0 && <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>No exams scheduled.</p>}
          {upcoming.map((exam) => (
            <UpcomingExamCard
              key={exam.id}
              exam={exam}
              onStart={(e) => navigate(`/student/exams/${e.id}/instructions`)}
            />
          ))}
        </div>

        <div className="col-12 col-lg-4">
          {/* Calendar replaces the old Notifications + Recent Results panels */}
          <ExamCalendar exams={exams} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboardPage;