import { useState, useEffect } from "react";
import {
  Users, GraduationCap, FileText, AlertTriangle,
  LayoutDashboard, UserCog, ClipboardList, LogOut, Plus, X
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats, getAllStudents, getAllFaculty, createFaculty } from "../services/adminService";
import "../styles/dashboard.css";
import logo from "../assets/logo.png";
const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [activeTab, setActiveTab] = useState("students");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const password = watch("password");

  useEffect(() => {
    const loadData = async () => {
      const [statsData, studentsData, facultyData] = await Promise.all([
        getDashboardStats(),
        getAllStudents(),
        getAllFaculty(),
      ]);
      setStats(statsData);
      setStudents(studentsData);
      setFaculty(facultyData);
      setLoading(false);
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
      setFormError(err.response?.data?.detail || "Failed to add faculty. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/student/login");
  };

  if (loading) return <div style={{ padding: 40 }}>Loading dashboard...</div>;

  const statCards = [
    { label: "Total Students", value: stats.totalStudents, icon: <GraduationCap size={18} color="#7C3AED" />, bg: "#F3E8FF" },
    { label: "Total Faculty", value: stats.totalFaculty, icon: <Users size={18} color="#4338CA" />, bg: "#E0E7FF" },
    { label: "Active Exams", value: stats.activeExams, icon: <FileText size={18} color="#0D9488" />, bg: "#CCFBF1" },
    { label: "Flagged Alerts", value: stats.flaggedAlerts, icon: <AlertTriangle size={18} color="#D97706" />, bg: "#FEF3C7" },
  ];

  const activeList = activeTab === "students" ? students : faculty;

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <img src={logo} alt="ExamProctor AI logo" />
          <span>ExamProctor AI</span>
        </div>

        <nav className="dash-nav">
          <button className="dash-nav-item active"><LayoutDashboard size={16} /> Overview</button>
          <button className="dash-nav-item"><UserCog size={16} /> Users</button>
          <button className="dash-nav-item"><ClipboardList size={16} /> Exam Monitoring</button>
        </nav>

        <button className="dash-logout" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <h1>Admin Dashboard</h1>
          <p>Overview of students, faculty, and exam activity.</p>
        </div>

        <div className="dash-stats">
          {statCards.map((card) => (
            <div className="dash-stat-card" key={card.label}>
              <div className="dash-stat-icon" style={{ background: card.bg }}>{card.icon}</div>
              <div className="dash-stat-value">{card.value}</div>
              <div className="dash-stat-label">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2>User Management</h2>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div className="dash-tabs">
                <button
                  className={`dash-tab ${activeTab === "students" ? "active" : ""}`}
                  onClick={() => setActiveTab("students")}
                >
                  Students
                </button>
                <button
                  className={`dash-tab ${activeTab === "faculty" ? "active" : ""}`}
                  onClick={() => setActiveTab("faculty")}
                >
                  Faculty
                </button>
              </div>
              {activeTab === "faculty" && (
                <button className="dash-add-btn" onClick={() => setShowModal(true)}>
                  <Plus size={15} /> Add Faculty
                </button>
              )}
            </div>
          </div>

          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeList.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.email}</td>
                  <td><span className="dash-badge">{person.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className="dash-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>Add Faculty</h3>
              <X size={18} style={{ cursor: "pointer" }} onClick={() => setShowModal(false)} />
            </div>

            {formError && <p className="error-banner">{formError}</p>}

            <form onSubmit={handleSubmit(handleAddFaculty)} noValidate>
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" placeholder="Faculty name"
                {...register("name", { required: "Name is required" })} />
              {errors.name && <p className="field-error">{errors.name.message}</p>}

              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="faculty@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
                })} />
              {errors.email && <p className="field-error">{errors.email.message}</p>}

              <label htmlFor="password">Temporary Password</label>
              <input id="password" type="password" placeholder="At least 6 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })} />
              {errors.password && <p className="field-error">{errors.password.message}</p>}

              <div className="dash-modal-actions">
                <button type="button" className="dash-modal-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-modal-submit" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;