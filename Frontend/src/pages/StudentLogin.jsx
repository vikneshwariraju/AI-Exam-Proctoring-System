import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const StudentLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (formData) => {
    setServerError("");
    setSubmitting(true);
    try {
      const data = await loginUser({ formData});
      login({ user_id: data.user_id, name: data.name, role: data.role });
    if (data.role === "student") navigate("/student/dashboard");
    else if (data.role === "faculty") navigate("/faculty/dashboard");
    else if (data.role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Student Login</h2>
        {serverError && <p className="error-banner">{serverError}</p>}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="you@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
          })} />
        {errors.email && <p className="field-error">{errors.email.message}</p>}

        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Enter password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })} />
        {errors.password && <p className="field-error">{errors.password.message}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          New student? <Link to="/student/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default StudentLogin;