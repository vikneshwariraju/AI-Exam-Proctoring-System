import { useState, useEffect } from "react";
import { FileText, CheckCircle2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentStats, getStudentExams, getNotifications } from "../../services/studentService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import StatisticsCard from "../../components/dashboard/StatisticsCard";
import UpcomingExamCard from "../../components/dashboard/UpcomingExamCard";
import NotificationCard from "../../components/dashboard/NotificationCard";
import RecentResultCard from "../../components/dashboard/RecentResultCard";
import Loader from "../../components/common/Loader";
import "../../styles/dashboard.css";
import "../../assets/logo.png";
const StudentDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [statsData, examsData, notifData] = await Promise.all([
        getStudentStats(),
        getStudentExams(),
        getNotifications(),
      ]);
      setStats(statsData);
      setExams(examsData);
      setNotifications(notifData);
      setLoading(false);
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

  const upcoming = exams.filter((e) => e.status !== "completed");
  const completed = exams.filter((e) => e.status === "completed");

  const statCards = [
    { label: "Total Exams", value: stats.totalExams, icon: <FileText size={17} color="#2563EB" />, bg: "#EFF6FF" },
    { label: "Completed", value: stats.completedExams, icon: <CheckCircle2 size={17} color="#059669" />, bg: "#ECFDF5" },
    { label: "Average Score", value: `${stats.averageScore}%`, icon: <TrendingUp size={17} color="#7C3AED" />, bg: "#F3E8FF" },
  ];

  return (
    <DashboardLayout activeItem="Dashboard">
      <WelcomeCard name={user?.name} />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {statCards.map((c) => <StatisticsCard key={c.label} {...c} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div>
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

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <NotificationCard notifications={notifications} />
          <RecentResultCard results={completed} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboardPage;