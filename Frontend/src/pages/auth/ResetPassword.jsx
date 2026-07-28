import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { KeyRound, Lock, ArrowLeft } from "lucide-react";
import { resetPassword, forgotPassword } from "../../services/authService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !otp.trim() || !newPassword || !confirmPassword) {
      setError("Please fill in every field.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/student/login"), 1800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "That OTP is invalid or expired. Please request a new one."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError("Enter your email above first.");
      return;
    }
    setResending(true);
    setError("");
    try {
      await forgotPassword(email.trim());
    } catch {
      setError("Couldn't resend the OTP. Please try again in a moment.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)",
        padding: 20,
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: 420, padding: 32 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)" }}>
          Reset Password
        </h2>
        <p style={{ margin: "0 0 24px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>
          Enter the OTP sent to your email along with your new password.
        </p>

        {success ? (
          <div style={{ fontSize: 13.5, color: "var(--color-success)", padding: "10px 0" }}>
            Password reset successfully. Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: "100%", height: 42, borderRadius: "var(--radius-md, 10px)",
                border: "1px solid var(--color-border, #E5E7EB)", padding: "0 12px",
                fontSize: 13.5, marginTop: 6, marginBottom: 14,
              }}
            />

            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
              OTP
            </label>
            <div style={{ position: "relative", marginTop: 6, marginBottom: 14 }}>
              <KeyRound size={16} style={{ position: "absolute", left: 12, top: 12, color: "#94A3B8" }} />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                required
                style={{
                  width: "100%", height: 42, borderRadius: "var(--radius-md, 10px)",
                  border: "1px solid var(--color-border, #E5E7EB)", paddingLeft: 36, paddingRight: 12,
                  fontSize: 13.5,
                }}
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
                style={{
                  width: "100%", height: 42, borderRadius: "var(--radius-md, 10px)",
                  border: "1px solid var(--color-border, #E5E7EB)", paddingLeft: 36, paddingRight: 12,
                  fontSize: 13.5,
                }}
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
                style={{
                  width: "100%", height: 42, borderRadius: "var(--radius-md, 10px)",
                  border: "1px solid var(--color-border, #E5E7EB)", paddingLeft: 36, paddingRight: 12,
                  fontSize: 13.5,
                }}
              />
            </div>

            {error && (
              <p style={{ fontSize: 12.5, color: "var(--color-danger)", marginBottom: 12 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary-brand"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="btn-secondary-brand"
              style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </form>
        )}

        <Link
          to="/student/login"
          style={{
            display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
            marginTop: 18, fontSize: 13, color: "var(--color-primary)", textDecoration: "none",
          }}
        >
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;