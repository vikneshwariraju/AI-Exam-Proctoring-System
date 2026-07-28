import { useState } from "react";
import { Lock } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { changePassword } from "../../services/authService";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill in every field.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword === oldPassword) {
      setError("New password must be different from the old password.");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.old_password?.[0] ||
        err.response?.data?.detail ||
        "Could not change your password. Please check your current password and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    width: "100%", height: 42, borderRadius: "var(--radius-md, 10px)",
    border: "1px solid var(--color-border, #E5E7EB)", paddingLeft: 36, paddingRight: 12,
    fontSize: 13.5,
  };

  return (
    <DashboardLayout activeItem="Settings">
      <div className="card" style={{ padding: 28, maxWidth: 460, margin: "0 auto" }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)" }}>
          Change Password
        </h2>
        <p style={{ margin: "0 0 22px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>
          Update the password you use to sign in.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
            Current Password
          </label>
          <div style={{ position: "relative", marginTop: 6, marginBottom: 14 }}>
            <Lock size={16} style={{ position: "absolute", left: 12, top: 12, color: "#94A3B8" }} />
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              required
              style={fieldStyle}
            />
          </div>

          <label style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
            New Password
          </label>
          <div style={{ position: "relative", marginTop: 6, marginBottom: 14 }}>
            <Lock size={16} style={{ position: "absolute", left: 12, top: 12, color: "#94A3B8" }} />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              style={fieldStyle}
            />
          </div>

          <label style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
            Confirm New Password
          </label>
          <div style={{ position: "relative", marginTop: 6, marginBottom: 14 }}>
            <Lock size={16} style={{ position: "absolute", left: 12, top: 12, color: "#94A3B8" }} />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              style={fieldStyle}
            />
          </div>

          {error && (
            <p style={{ fontSize: 12.5, color: "var(--color-danger)", marginBottom: 12 }}>{error}</p>
          )}
          {success && (
            <p style={{ fontSize: 12.5, color: "var(--color-success)", marginBottom: 12 }}>{success}</p>
          )}

          <button
            type="submit"
            className="btn-primary-brand"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;