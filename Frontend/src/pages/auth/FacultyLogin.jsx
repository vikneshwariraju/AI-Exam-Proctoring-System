import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineUserGroup
} from "react-icons/hi";

import {
    MdOutlineMonitor
} from "react-icons/md";

import {
    AiOutlineBarChart
} from "react-icons/ai";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import "../../styles/auth.css";

import logo from "../../assets/logo.png";

export default function FacultyLogin() {

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

            const data = await loginUser(formData, "faculty");

            login({
                user_id: data.user_id,
                name: data.name,
                role: data.role
            });

            navigate("/faculty/dashboard");

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
                        Faculty portal for creating examinations, monitoring students
                        live with AI proctoring, and reviewing performance reports.
                    </p>

                    <div className="feature-box">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <HiOutlineUserGroup />
                            </div>
                            <div>
                                <div className="feature-title">
                                    Faculty Dashboard
                                </div>

                                <div className="feature-subtitle">
                                    Manage exams and students
                                </div>

                            </div>

                        </div>

                        <div className="feature-item">

                            <div className="feature-icon">

                                <MdOutlineMonitor />

                            </div>

                            <div>

                                <div className="feature-title">

                                    AI Proctoring

                                </div>

                                <div className="feature-subtitle">

                                    Detect suspicious activities

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

                            Faculty Login

                        </h2>

                        <p className="auth-subtitle">

                            Sign in to continue

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
                                    <label>Faculty Email</label>
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
                            Student?
                            <Link to="/student/login">
                                Login Here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}