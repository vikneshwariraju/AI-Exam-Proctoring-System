import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerStudent } from "../services/authService";
import "../styles/auth.css";

const StudentRegister = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (formData) => {
    setServerError("");
    setSubmitting(true);
    try {
      await registerStudent(formData);
      setSuccess(true);
      setTimeout(() => navigate("/student/login"), 1200);
    } catch (err) {
      setServerError(err.response?.data?.detail || err.response?.data?.email?.[0] || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Student Registration</h2>
        {serverError && <p className="error-banner">{serverError}</p>}
        {success && <p className="success-banner">Account created! Redirecting to login...</p>}

        <label htmlFor="name">Full Name</label>
        <input id="name" type="text" placeholder="Your full name"
          {...register("name", { required: "Name is required" })} />
        {errors.name && <p className="field-error">{errors.name.message}</p>}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="you@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
          })} />
        {errors.email && <p className="field-error">{errors.email.message}</p>}

        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="At least 6 characters"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })} />
        {errors.password && <p className="field-error">{errors.password.message}</p>}

        <label htmlFor="confirm_password">Confirm Password</label>
        <input id="confirm_password" type="password" placeholder="Re-enter password"
          {...register("confirm_password", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })} />
        {errors.confirm_password && <p className="field-error">{errors.confirm_password.message}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/student/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default StudentRegister;