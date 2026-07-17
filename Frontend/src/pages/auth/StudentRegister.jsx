import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineUser,
    HiOutlineAcademicCap
} from "react-icons/hi";

import {
    MdOutlineMonitor
} from "react-icons/md";

import {
    AiOutlineBarChart
} from "react-icons/ai";

import { registerStudent } from "../../services/authService";

import "../../styles/auth.css";

import logo from "../../assets/logo.png";

export default function StudentRegister() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [serverError, setServerError] = useState("");
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch("password");

    const onSubmit = async (formData) => {

        setServerError("");
        setSuccess(false);

        setSubmitting(true);

        try {

            await registerStudent(formData);

            setSuccess(true);

            setTimeout(() => {
                navigate("/student/login");
            }, 1500);

        }

        catch (err) {

            setServerError(
                err.response?.data?.email?.[0] ||
                err.response?.data?.password?.[0] ||
                err.response?.data?.confirm_password?.[0] ||
                err.response?.data?.name?.[0] ||
                err.response?.data?.detail ||
                "Registration failed."
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
                        Create your student account to attend secure AI-powered online
                        examinations, monitor your progress, and access detailed
                        performance reports.
                    </p>

                    <div className="feature-box">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <HiOutlineAcademicCap />
                            </div>
                            <div>
                                <div className="feature-title">
                                    Student Registration
                                </div>

                                <div className="feature-subtitle">
                                    Quick and secure account creation
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

                                    Smart online exam supervision

                                </div>

                            </div>

                        </div>

                        <div className="feature-item">

                            <div className="feature-icon">

                                <AiOutlineBarChart />

                            </div>

                            <div>

                                <div className="feature-title">

                                    Performance Reports

                                </div>

                                <div className="feature-subtitle">

                                    View scores and detailed analytics

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* RIGHT PANEL */}

                <div className="auth-right">

                    <div className="auth-card">

                        <h2 className="auth-title">

                            Create Account

                        </h2>

                        <p className="auth-subtitle">

                            Register to continue

                        </p>

                        {serverError &&
                            <div className="error-banner">
                                {serverError}
                            </div>
                        }

                        {success &&
                            <div className="success-banner">
                                Registration Successful ✓
                            </div>
                        }

                        <form
                            className="auth-form"
                            onSubmit={handleSubmit(onSubmit)}
                        >

                            {/* FULL NAME */}

                            <div>

                                <div className="input-group">
                                    <HiOutlineUser className="input-icon" />

                                    <input
                                        type="text"
                                        placeholder=" "
                                        {...register("name", {
                                            required: "Full name is required"
                                        })}
                                    />
                                    <label>Full Name</label>
                                </div>
                                {errors.name &&
                                    <p className="field-error">
                                        {errors.name.message}
                                    </p>
                                }
                            </div>

                            {/* EMAIL */}

                            <div>

                                <div className="input-group">
                                    <HiOutlineMail className="input-icon" />

                                    <input
                                        type="email"
                                        placeholder=" "
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^\S+@\S+\.\S+$/,
                                                message: "Enter a valid email"
                                            }
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
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Minimum 6 characters"
                                            }
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

                            {/* CONFIRM PASSWORD */}

                            <div>
                                <div className="input-group">
                                    <HiOutlineLockClosed className="input-icon" />
                                    <input
                                        type={
                                            showConfirm
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder=" "
                                        {...register("confirm_password", {
                                            required: "Confirm password is required",
                                            validate: value =>
                                                value === password ||
                                                "Passwords do not match"
                                        })}
                                    />
                                    <label>Confirm Password</label>
                                    <span
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowConfirm(!showConfirm)
                                        }
                                    >

                                        {
                                            showConfirm
                                                ? <HiOutlineEyeOff />
                                                : <HiOutlineEye />
                                        }

                                    </span>

                                </div>

                                {errors.confirm_password &&
                                    <p className="field-error">

                                        {errors.confirm_password.message}

                                    </p>
                                }

                            </div>

                            <button
                                className="auth-btn"
                                disabled={submitting}
                            >

                                {
                                    submitting
                                        ? "Creating Account..."
                                        : "Create Account"
                                }

                            </button>

                        </form>

                        <div className="divider">

                            <span>OR</span>

                        </div>

                        <p className="auth-switch">

                            Already have an account?

                            <Link to="/student/login">

                                Login

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