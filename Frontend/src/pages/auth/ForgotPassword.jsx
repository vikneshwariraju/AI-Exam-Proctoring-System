import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email.trim());
      // OTP has been emailed — carry the email forward so the user
      // doesn't have to retype it on the next screen.
      navigate("/reset-password", { state: { email: email.trim() } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "We couldn't send an OTP to that email. Please check it and try again."
      );
    } finally {
      setLoading(false);
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
      <div
        className="card"
        style={{ width: "100%", maxWidth: 400, padding: 32 }}
      >
        <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)" }}>
          Forgot Password
        </h2>
        <p style={{ margin: "0 0 24px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>
          Enter your registered email and we'll send you a one-time code to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
            Email Address
          </label>
          <div style={{ position: "relative", marginTop: 6, marginBottom: 14 }}>
            <Mail size={16} style={{ position: "absolute", left: 12, top: 12, color: "#94A3B8" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: "100%",
                height: 42,
                borderRadius: "var(--radius-md, 10px)",
                border: "1px solid var(--color-border, #E5E7EB)",
                paddingLeft: 36,
                paddingRight: 12,
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
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

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

export default ForgotPassword;