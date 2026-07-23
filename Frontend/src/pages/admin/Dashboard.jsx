import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import StatisticsCard from "../../components/dashboard/StatisticsCard";
import Loader from "../../components/common/Loader";

import StudentTable from "../../components/admin/StudentTable";
import FacultyTable from "../../components/admin/FacultyTable";
import ExamTable from "../../components/admin/ExamTable";

import {
  getDashboardStats,
  getAllStudents,
  getAllFaculty,
  getAllExams,
} from "../../services/adminService";

const AdminDashboard = () => {

  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadData = async () => {

      try {

        const [
          statsData,
          studentsData,
          facultyData,
          examsData,
        ] = await Promise.all([
          getDashboardStats(),
          getAllStudents(),
          getAllFaculty(),
          getAllExams(),
        ]);

        setStats(statsData);
        setStudents(studentsData);
        setFaculty(facultyData);
        setExams(examsData);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }

    };

    loadData();

  }, []);

  if (loading) {
    return (
      <DashboardLayout activeItem="Dashboard">
        <Loader label="Loading Admin Dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="Dashboard">

      <WelcomeCard name="Administrator" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 18,
          marginBottom: 25,
        }}
      >

        <StatisticsCard
          label="Students"
          value={stats.totalStudents}
          icon={<Users size={18} />}
        />

        <StatisticsCard
          label="Faculty"
          value={stats.totalFaculty}
          icon={<UserCheck size={18} />}
        />

        <StatisticsCard
          label="Active Exams"
          value={stats.activeExams}
          icon={<BookOpen size={18} />}
        />

        <StatisticsCard
          label="AI Alerts"
          value={stats.flaggedAlerts}
          icon={<AlertTriangle size={18} />}
        />

      </div>

      <StudentTable students={students} />

      <br />

      <FacultyTable faculty={faculty} />

      <br />

      <ExamTable exams={exams} />

    </DashboardLayout>
  );
};

export default AdminDashboard;