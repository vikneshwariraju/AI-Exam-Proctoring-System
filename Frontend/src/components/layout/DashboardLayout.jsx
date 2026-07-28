import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Menu, X, UserCircle, Settings, KeyRound, LogOut
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/layout.css";
import logo from "../../assets/logo.png";

const NAV_ITEMS = {
  student: [
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "Available Exams", path: "/student/dashboard" },
    { label: "Results", path: "/student/results" },
    { label: "Performance", path: "/student/performance" },
  ],
  faculty: [
    { label: "Dashboard", path: "/faculty/dashboard" },
    { label: "Create Exam", path: "/faculty/exams/create" },
    { label: "Manage Exams", path: "/faculty/dashboard" },
    { label: "Questions", path: "/faculty/questions" },
    { label: "Results", path: "/faculty/results" },
  ],
  admin: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Students", path: "/admin/students" },
    { label: "Faculty", path: "/admin/faculty" },
    { label: "Exams", path: "/admin/exams" },
    { label: "AI Alerts", path: "/admin/ai-alerts" },
    { label: "Reports", path: "/admin/reports" },
  ],
};

const DashboardLayout = ({ children, activeItem }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const role = user?.role || "student";
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.student;
  const initials = (user?.name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(role === "faculty" ? "/faculty/login" : "/student/login");
  };

  const goTo = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#F9FAFB" }}>

      {/* SIDEBAR - hidden below md, shown as fixed column above */}
      <aside
        className="bg-brand-gradient text-white d-none d-md-flex flex-column p-3 sticky-top"
        style={{ width: 230, height: "100vh", top: 0 }}
      >
        <div
          className="d-flex align-items-center gap-2 fw-bold mb-4 px-1"
          role="button"
          onClick={() => goTo(`/${role}/dashboard`)}
        >
          <img
            src={logo}
            alt="logo"
            style={{ width: 25, height: 25, objectFit: "contain", filter: "brightness(0) invert(1)" }}
          />
          <span>ExamProctor AI</span>
        </div>

        <nav className="d-flex flex-column gap-1 flex-grow-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`btn nav-link-brand rounded px-3 py-2 ${activeItem === item.label ? "active" : ""}`}
              style={{ fontSize: 13.5 }}
              onClick={() => goTo(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN COLUMN */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>

        {/* TOPBAR */}
        <div
          className="d-flex align-items-center justify-content-end gap-3 px-4 bg-white border-bottom"
          style={{ height: 58 }}
        >
          <div className="position-relative text-secondary" role="button">
            <Bell size={18} />
            <span
              className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
            />
          </div>

          <button
            className="btn d-md-none p-1"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="position-relative" ref={dropdownRef}>
            <button
              className="btn bg-brand text-white rounded-circle d-flex align-items-center justify-content-center p-0"
              style={{ width: 30, height: 30, fontSize: 12, fontWeight: 700 }}
              onClick={() => setDropdownOpen((o) => !o)}
            >
              {initials}
            </button>

            {dropdownOpen && (
              <div
                className="dropdown-menu show shadow-sm p-0"
                style={{ position: "absolute", right: 0, top: 42, width: 220 }}
              >
                <div className="px-3 py-2 border-bottom">
                  <div className="fw-semibold" style={{ fontSize: 14 }}>{user?.name || "User"}</div>
                  <span className="badge bg-primary-subtle text-brand text-capitalize mt-1">
                    {role}
                  </span>
                </div>

                <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => goTo(`/${role}/profile`)}>
                  <UserCircle size={15} /> My Profile
                </button>
                <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => goTo(`/${role}/settings`)}>
                  <Settings size={15} /> Settings
                </button>
                <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => goTo(`/${role}/change-password`)}>
                  <KeyRound size={15} /> Change Password
                </button>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger border-top"
                  onClick={handleLogout}
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE NAV */}
        {mobileOpen && (
          <div className="d-md-none d-flex flex-column gap-1 px-4 py-2 bg-white border-bottom">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`btn text-start rounded px-3 py-2 ${activeItem === item.label ? "bg-brand text-white fw-semibold" : "text-dark"}`}
                onClick={() => goTo(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* PAGE CONTENT */}
        <main className="flex-grow-1 mx-auto w-100 px-3 py-4" style={{ maxWidth: 1200 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;