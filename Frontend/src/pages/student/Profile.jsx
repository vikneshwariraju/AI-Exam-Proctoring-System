import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { Mail, ShieldCheck, IdCard } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();

  const initials = (user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DashboardLayout activeItem="Profile">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="card" style={{ width: "100%", maxWidth: 400, padding: "36px 32px" }}>

          {/* Avatar */}
          <div className="d-flex justify-content-center">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
              style={{
                width: 96,
                height: 96,
                fontSize: 30,
                background: "var(--color-primary)",
                boxShadow: "0 6px 18px rgba(59, 130, 246, 0.25)",
              }}
            >
              {initials}
            </div>
          </div>

          {/* Name + role */}
          <h2
            className="text-center mt-3 mb-2"
            style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)" }}
          >
            {user?.name || "User"}
          </h2>

          <div className="d-flex justify-content-center mb-4">
            <span
              className="text-capitalize"
              style={{
                background: "#F1F5F9",
                color: "var(--color-text-secondary)",
                fontSize: 12.5,
                fontWeight: 600,
                padding: "5px 16px",
                borderRadius: 20,
              }}
            >
              {user?.role || "user"}
            </span>
          </div>

          {/* Info rows */}
          <div className="d-flex flex-column gap-3">

            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                style={{ width: 42, height: 42, background: "#F1F5F9", color: "var(--color-text-secondary)" }}
              >
                <Mail size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                  Email Address
                </div>
                <div
                  style={{
                    fontSize: 14.5,
                    color: "var(--color-text-primary)",
                    fontWeight: 600,
                    marginTop: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={user?.email || "Not available"}
                >
                  {user?.email || "Not available"}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                style={{ width: 42, height: 42, background: "#F1F5F9", color: "var(--color-text-secondary)" }}
              >
                <IdCard size={18} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                  {user?.role === "faculty" ? "Faculty ID" : user?.role === "admin" ? "Admin ID" : "Student ID"}
                </div>
                <div style={{ fontSize: 14.5, color: "var(--color-text-primary)", fontWeight: 600, marginTop: 2 }}>
                  {user?.user_id ?? "—"}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                style={{ width: 42, height: 42, background: "#F1F5F9", color: "var(--color-text-secondary)" }}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                  Account Access
                </div>
                <div style={{ fontSize: 14.5, color: "var(--color-text-primary)", fontWeight: 600, marginTop: 2, textTransform: "capitalize" }}>
                  {user?.role || "user"}
                </div>
              </div>
            </div>

          </div>

          <button
            className="w-100 mt-4"
            style={{
              height: 46,
              border: "none",
              borderRadius: 10,
              background: "var(--color-primary)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "0.2s",
            }}
            onClick={() => alert("Edit profile — coming soon")}
          >
            Edit Profile
          </button>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;