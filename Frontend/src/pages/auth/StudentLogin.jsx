import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineShieldCheck
} from "react-icons/hi";

import {
    MdOutlineMonitor
} from "react-icons/md";

import {
    AiOutlineBarChart
} from "react-icons/ai";

import {
    FiClock
} from "react-icons/fi";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import "../../styles/auth.css";

import logo from "../../assets/logo.png";

export default function StudentLogin() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const [serverError, setServerError] = useState("");

    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (formData) => {

        setServerError("");

        setSubmitting(true);

        try {

            const data = await loginUser(formData);

            login({
                user_id: data.user_id,
                name: data.name,
                role: data.role
            });

            if (data.role === "student")
                navigate("/student/dashboard");

            else if (data.role === "faculty")
                navigate("/faculty/dashboard");

            else
                navigate("/admin/dashboard");

        }

        catch (err) {

            setServerError(
                err.response?.data?.detail ||
                "Invalid email or password."
            );

        }

        finally {

            setSubmitting(false);

        }

    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* LEFT PANEL */}
                <div className="auth-left">
                    <div className="brand">
                    <img
                        src={logo}
                        alt="Logo"
                        className="auth-logo"
                    />
                    <h1>
                       ExamProctor AI
                    </h1>
                    </div>
                    <p className="auth-description">
                        Secure online examinations with AI based monitoring,
                        live tracking and detailed performance analysis.
                    </p>

                    <div className="feature-box">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <HiOutlineShieldCheck />
                            </div>
                            <div>
                                <div className="feature-title">
                                    Secure Authentication
                                </div>

                                <div className="feature-subtitle">
                                    JWT based secure login system
                                </div>

                            </div>

                        </div>

                        <div className="feature-item">

                            <div className="feature-icon">

                                <MdOutlineMonitor />

                            </div>

                            <div>

                                <div className="feature-title">

                                    AI Monitoring

                                </div>

                                <div className="feature-subtitle">

                                    Detect suspicious activities

                                </div>

                            </div>

                        </div>

                        <div className="feature-item">

                            <div className="feature-icon">

                                <FiClock />

                            </div>

                            <div>

                                <div className="feature-title">

                                    Live Exam Timer

                                </div>

                                <div className="feature-subtitle">

                                    Real-time exam monitoring

                                </div>

                            </div>

                        </div>

                        <div className="feature-item">

                            <div className="feature-icon">

                                <AiOutlineBarChart />

                            </div>

                            <div>

                                <div className="feature-title">

                                    Performance Analytics

                                </div>

                                <div className="feature-subtitle">

                                    Instant result analysis

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* RIGHT PANEL */}

                <div className="auth-right">

                    <div className="auth-card">

                        <h2 className="auth-title">

                            Welcome Back !

                        </h2>

                        <p className="auth-subtitle">

                            Login to continue

                        </p>

                        {serverError &&
                            <div className="error-banner">
                                {serverError}
                            </div>
                        }
                        <form
                            className="auth-form"
                            onSubmit={handleSubmit(onSubmit)}
                        >

                            {/* EMAIL */}

                            <div>

                                <div className="input-group">
                                    <HiOutlineMail className="input-icon" />

                                    <input
                                        type="email"
                                        placeholder=" "
                                        {...register("email", {
                                            required: "Email is required"
                                        })}
                                    />
                                    <label>Email Address</label>
                                </div>
                                {errors.email &&
                                    <p className="field-error">
                                        {errors.email.message}
                                    </p>
                                }
                            </div>
                            {/* PASSWORD */}
                            <div>
                                <div className="input-group">
                                    <HiOutlineLockClosed className="input-icon" />
                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder=" "
                                        {...register("password", {
                                            required: "Password is required"
                                        })}
                                    />
                                    <label>Password</label>
                                    <span
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >

                                        {
                                            showPassword
                                                ? <HiOutlineEyeOff />
                                                : <HiOutlineEye />
                                        }

                                    </span>

                                </div>

                                {errors.password &&
                                    <p className="field-error">

                                        {errors.password.message}

                                    </p>
                                }

                            </div>

                            {/* OPTIONS */}

                            <div className="auth-options">

                                <label>

                                    <input type="checkbox" />

                                    {" "}Remember me

                                </label>

                                <a href="#">

                                    Forgot Password?

                                </a>

                            </div>

                            <button
                                className="auth-btn"
                                disabled={submitting}
                            >

                                {
                                    submitting
                                        ? "Signing In..."
                                        : "Login"
                                }

                            </button>

                        </form>

                        <div className="divider">

                            <span>OR</span>

                        </div>

                        <p className="auth-switch">

                            New Student?

                            <Link to="/student/register">

                                Create Account

                            </Link>

                        </p>

                        <p className="auth-switch">

                            Faculty?

                            <Link to="/faculty/login">

                                Faculty Login

                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}