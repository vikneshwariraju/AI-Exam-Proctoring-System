import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";
import logo from "../../assets/logo.png";

import {
  FaEnvelope,
  FaLock,
  FaUserTie,
  FaRobot,
  FaClipboardCheck
} from "react-icons/fa";

const FacultyLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (formData) => {
    setServerError("");

    try {
      const data = await loginUser(formData, "faculty");

      login({
        user_id: data.user_id,
        name: data.name,
        role: data.role,
      });

      navigate("/faculty/dashboard");

    } catch (err) {
      setServerError(
        err.response?.data?.detail ||
          "Invalid email or password."
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <img src={logo} className="auth-logo" alt="logo" />

        <h1>AI Powered Online Exam Proctoring System</h1>

        <p className="auth-description">
          Faculty Portal for managing examinations and student results.
        </p>

        <div className="feature-box">

          <div className="feature-item">
            <FaUserTie />
            Faculty Dashboard
          </div>

          <div className="feature-item">
            <FaClipboardCheck />
            Manage Exams
          </div>

          <div className="feature-item">
            <FaRobot />
            AI Proctoring
          </div>

        </div>

      </div>

      <div className="auth-right">

        <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>

          <h2>Faculty Login</h2>

          <p className="subtitle">
            Sign in to continue
          </p>

          {serverError && (
            <div className="error-banner">{serverError}</div>
          )}

          <div className="input-group">

            <FaEnvelope className="input-icon" />

            <input
              placeholder="Faculty Email"
              {...register("email", { required: true })}
            />

          </div>

          <div className="input-group">

            <FaLock className="input-icon" />

            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />

          </div>

          <button disabled={submitting}>
            {submitting ? "Logging..." : "Login"}
          </button>

          <p className="auth-switch">
            Student?
            <Link to="/student/login"> Login Here</Link>
          </p>

        </form>

      </div>

    </div>
  );
};

export default FacultyLogin;