import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  BookOpen,
  AlertTriangle,
  Shield,
  Layers,
  Plus,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";

import DashboardLayout from "../../components/layout/DashboardLayout";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import StatisticsCard from "../../components/dashboard/StatisticsCard";
import Loader from "../../components/common/Loader";

import StudentTable from "../../components/admin/StudentTable";
import FacultyTable from "../../components/admin/FacultyTable";
import ExamTable from "../../components/admin/ExamTable";

import {
  getDashboardStats,
  getUserStats,
  getAllStudents,
  getAllFaculty,
  getAllExams,
  createFaculty,
} from "../../services/adminService";

const AdminDashboard = () => {

  const [stats, setStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const password = watch("password");

  useEffect(() => {

    const loadData = async () => {

      try {

        const [
          statsData,
          userStatsData,
          studentsData,
          facultyData,
          examsData,
        ] = await Promise.all([
          getDashboardStats(),
          getUserStats(),
          getAllStudents(),
          getAllFaculty(),
          getAllExams(),
        ]);

        setStats(statsData);
        setUserStats(userStatsData);
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

  const handleAddFaculty = async (formData) => {
    setFormError("");
    setSubmitting(true);
    try {
      const newFaculty = await createFaculty(formData);
      setFaculty((prev) => [...prev, newFaculty]);
      reset();
      setShowModal(false);
    } catch (err) {
      setFormError(
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.confirm_password?.[0] ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to add faculty. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeItem="Dashboard">
        <Loader label="Loading Admin Dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="Dashboard">

      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 6, color: "var(--color-text-primary)" }}>
        Admin Dashboard
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", marginBottom: 24 }}>
        Overview of platform activity, users, and exam status.
      </p>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4">
          <StatisticsCard
            label="Active Exams"
            value={stats.activeExams}
            icon={<BookOpen size={22} color="var(--color-accent)" />}
          />
        </div>

        <div className="col-6 col-md-4">
          <StatisticsCard
            label="AI Alerts"
            value={stats.flaggedAlerts ?? "—"}
            icon={<AlertTriangle size={22} color="var(--color-danger)" />}
          />
        </div>

        <div className="col-6 col-md-4">
          <StatisticsCard
            label="Total Users"
            value={userStats?.totalUsers ?? "—"}
            icon={<Layers size={22} color="var(--color-warning)" />}
          />
        </div>
      </div>

      {stats.statsEndpointMissing && (
        <div className="card" style={{ padding: "12px 16px", marginBottom: 20, background: "#FFFBEB", borderColor: "#FDE68A", fontSize: 13, color: "#92400E" }}>
          Could not load admin stats — check that <code>GET /api/admin/dashboard/</code>,
          <code> /api/admin/students/</code>, and <code>/api/admin/faculty/</code> are reachable.
        </div>
      )}

      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 15.5, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 12 }}>
        Students
      </h3>
      <div style={{ overflowX: "auto", marginBottom: 28 }}>
        <StudentTable students={students} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 15.5, fontWeight: 600, color: "var(--color-text-primary)", margin: 0 }}>
          Faculty
        </h3>
        <button
          className="btn-primary-brand d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus size={15} /> Add Faculty
        </button>
      </div>
      <div style={{ overflowX: "auto", marginBottom: 28 }}>
        <FacultyTable faculty={faculty} />
      </div>

      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 15.5, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 12 }}>
        Exams
      </h3>
      <div style={{ overflowX: "auto" }}>
        <ExamTable exams={exams} />
      </div>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: 16 }}
        >
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ padding: 28, width: 400, maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 17, margin: 0 }}>Add Faculty</h3>
              <X size={18} style={{ cursor: "pointer" }} onClick={() => setShowModal(false)} />
            </div>

            {formError && (
              <div style={{ background: "#FEF2F2", color: "#B91C1C", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit(handleAddFaculty)} noValidate className="d-flex flex-column gap-3">
              <div>
                <label style={{ fontSize: 12.5, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Faculty name"
                  style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 12px", fontSize: 13.5 }}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.name.message}</p>}
              </div>

              <div>
                <label style={{ fontSize: 12.5, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Email</label>
                <input
                  type="email"
                  placeholder="faculty@gmail.com"
                  style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 12px", fontSize: 13.5 }}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
                  })}
                />
                {errors.email && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
              </div>

              <div>
                <label style={{ fontSize: 12.5, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Temporary Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 12px", fontSize: 13.5 }}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                {errors.password && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
              </div>

              <div>
                <label style={{ fontSize: 12.5, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 12px", fontSize: 13.5 }}
                  {...register("confirm_password", {
                    required: "Confirm password is required",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                />
                {errors.confirm_password && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.confirm_password.message}</p>}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
                <button type="button" className="btn-secondary-brand" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-brand" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default AdminDashboard;