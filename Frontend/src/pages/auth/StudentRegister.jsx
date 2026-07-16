import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerStudent } from "../../services/authService";
import "../../styles/auth.css";
import logo from "../../assets/logo.png";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserGraduate,
  FaRobot,
  FaChartLine,
} from "react-icons/fa";

const StudentRegister = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const password = watch("password");

  const onSubmit = async (formData) => {
    setServerError("");
    setSubmitting(true);

    try {
      await registerStudent(formData);

      setSuccess(true);

      setTimeout(() => {
        navigate("/student/login");
      }, 1500);
    } catch (err) {
      setServerError(
        err.response?.data?.detail ||
          err.response?.data?.email?.[0] ||
          "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT PANEL */}

      <div className="auth-left">
        <div className="brand-row">
          <img src={logo} alt="logo" className="auth-logo" />

          <h1>ExamProctor AI</h1>
        </div>

        <p className="auth-description">
          Create your student account and attend AI monitored examinations
          securely from anywhere.
        </p>

        <div className="feature-box">
          <div className="feature-item">
            <FaUserGraduate className="feature-icon" />
            Student Registration
          </div>

          <div className="feature-item">
            <FaRobot className="feature-icon" />
            AI Based Monitoring
          </div>

          <div className="feature-item">
            <FaChartLine className="feature-icon" />
            Performance Reports
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className="auth-right">
        <form
          className="auth-card"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <h2>Create Account</h2>

          <p className="subtitle">
            Register to continue
          </p>

          {serverError && (
            <div className="error-banner">
              {serverError}
            </div>
          )}

          {success && (
            <div className="success-banner">
              Registration Successful ✓
            </div>
          )}

          {/* NAME */}

          <div className="input-group">
            <FaUser className="input-icon" />

            <input
              type="text"
              placeholder="Full Name"
              {...register("name", {
                required: "Full name is required",
              })}
            />
          </div>

          {errors.name && (
            <p className="field-error">
              {errors.name.message}
            </p>
          )}

          {/* EMAIL */}

          <div className="input-group">
            <FaEnvelope className="input-icon" />

            <input
              type="email"
              placeholder="Email Address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email",
                },
              })}
            />
          </div>

          {errors.email && (
            <p className="field-error">
              {errors.email.message}
            </p>
          )}

          {/* PASSWORD */}

          <div className="input-group">
            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
            />

            <span
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>
          </div>

          {errors.password && (
            <p className="field-error">
              {errors.password.message}
            </p>
          )}

          {/* CONFIRM PASSWORD */}

          <div className="input-group">
            <FaLock className="input-icon" />

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirm_password", {
                required: "Confirm password is required",

                validate: (value) =>
                  value === password ||
                  "Passwords do not match",
              })}
            />

            <span
              className="password-toggle"
              onClick={() =>
                setShowConfirm(!showConfirm)
              }
            >
              {showConfirm ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>
          </div>

          {errors.confirm_password && (
            <p className="field-error">
              {errors.confirm_password.message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Creating Account..."
              : "Create Account →"}
          </button>

          <p className="auth-switch">
            Already have an account?

            <Link to="/student/login">
              {" "}
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;