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
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 20 }}>My Profile</h1>

      <div className="card overflow-hidden" style={{ maxWidth: 520 }}>

        {/* Gradient banner, same palette as the login/register pages */}
        <div
          style={{
            height: 90,
            background: "linear-gradient(135deg, #2563EB, #4F46E5, #7C3AED)"
          }}
        />

        <div className="px-4 pb-4" style={{ marginTop: -40 }}>

          {/* Avatar */}
          <div
            className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold border border-4 border-white"
            style={{
              width: 80,
              height: 80,
              fontSize: 26,
              background: "linear-gradient(135deg, #2563EB, #4F46E5)",
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)"
            }}
          >
            {initials}
          </div>

          <h2 className="mt-3 mb-0" style={{ fontFamily: "var(--font-heading)", fontSize: 19, color: "var(--color-text-primary)" }}>
            {user?.name || "Student"}
          </h2>

          <span
            className="badge text-capitalize mt-2"
            style={{ background: "#EFF6FF", color: "var(--color-primary)", fontSize: 12, padding: "5px 12px", borderRadius: 20 }}
          >
            {user?.role || "student"}
          </span>

          <hr className="my-4" style={{ borderColor: "var(--color-border)" }} />

          <div className="d-flex flex-column gap-3">

            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: 36, height: 36, background: "#EFF6FF", color: "var(--color-primary)" }}
              >
                <Mail size={16} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Email</div>
                <div style={{ fontSize: 13.5, color: "var(--color-text-primary)", fontWeight: 500 }}>
                  {user?.email || "Not available"}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: 36, height: 36, background: "#F3E8FF", color: "var(--color-accent)" }}
              >
                <IdCard size={16} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>User ID</div>
                <div style={{ fontSize: 13.5, color: "var(--color-text-primary)", fontWeight: 500 }}>
                  {user?.user_id ?? "—"}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: 36, height: 36, background: "#ECFDF5", color: "var(--color-success)" }}
              >
                <ShieldCheck size={16} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Account Type</div>
                <div style={{ fontSize: 13.5, color: "var(--color-text-primary)", fontWeight: 500, textTransform: "capitalize" }}>
                  {user?.role || "student"}
                </div>
              </div>
            </div>

          </div>

          <button
            className="btn-secondary-brand w-100 mt-4"
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