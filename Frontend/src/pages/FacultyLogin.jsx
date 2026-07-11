import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const FacultyLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (formData) => {
    setServerError("");
    setSubmitting(true);
    try {
      const data = await loginUser(formData, "faculty");
      login({ user_id: data.user_id, name: data.name, role: data.role });
      navigate("/faculty/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Faculty Login</h2>
        {serverError && <p className="error-banner">{serverError}</p>}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="faculty@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
          })} />
        {errors.email && <p className="field-error">{errors.email.message}</p>}

        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Enter password"
          {...register("password", { required: "Password is required" })} />
        {errors.password && <p className="field-error">{errors.password.message}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          Are you a student? <Link to="/student/login">Student login</Link>
        </p>
      </form>
    </div>
  );
};

export default FacultyLogin;