import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamDetails } from "../../services/examService";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import { ArrowLeft, FileText } from "lucide-react";

const ExamInstructions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    setLoading(true);
    setLoadError("");

    getExamDetails(examId)
      .then((data) => {
        if (!data) {
          setLoadError("This exam couldn't be found. It may have been removed.");
        } else {
          setExam(data);
        }
      })
      .catch((err) => {
        setLoadError(
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "Could not load this exam. Please try again."
        );
      })
      .finally(() => setLoading(false));
  }, [examId]);

  if (loading) {
    return (
      <DashboardLayout activeItem="Available Exams">
        <Loader label="Loading exam details..." />
      </DashboardLayout>
    );
  }

  if (loadError || !exam) {
    return (
      <DashboardLayout activeItem="Available Exams">
        <button
          onClick={() => navigate(-1)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", marginBottom: 18 }}
        >
          <ArrowLeft size={15} /> Back to dashboard
        </button>
        <div className="card" style={{ padding: 24, color: "#b91c1c" }}>
          {loadError || "Exam not found."}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="Available Exams">
      <button
        onClick={() => navigate(-1)}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", marginBottom: 18 }}
      >
        <ArrowLeft size={15} /> Back to dashboard
      </button>

      <div className="card" style={{ padding: 36, maxWidth: 640 }}>

        {/* Greeting header, matching the reference screenshot */}
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 20, margin: "0 0 6px", color: "var(--color-text-primary)" }}>
          Hello, {user?.name || "Student"}!
        </h1>
        <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", marginBottom: 4 }}>
          You're about to begin an online assessment. Please read the exam details and instructions carefully before starting.
        </p>

        <hr style={{ margin: "22px 0", border: "none", borderTop: "1px solid var(--color-border)" }} />

        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 17, margin: "0 0 8px", color: "var(--color-text-primary)" }}>
          {exam.title}
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginBottom: 16, fontSize: 13, color: "var(--color-text-primary)" }}>
          <div><b>Duration:</b> {exam.duration} min</div>
          <div><b>Marks:</b> {exam.totalMarks}</div>
          {exam.deadline && <div><b>Deadline:</b> {exam.deadline}</div>}
        </div>

        {exam.description && (
          <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: 22 }}>
            {exam.description}
          </p>
        )}

        <button
          className="btn-primary-brand"
          onClick={() => navigate(`/student/exams/${examId}/attend`)}
        >
          Let's start the exam
        </button>

        <hr style={{ margin: "28px 0", border: "none", borderTop: "1px solid var(--color-border)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <FileText size={16} color="var(--color-primary)" />
          <h4 style={{ fontSize: 14.5, fontWeight: 600, margin: 0, color: "var(--color-text-primary)" }}>Instructions</h4>
        </div>

        {exam.instructions.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
➜ Read all questions carefully before answering.<br></br>

➜ Ensure your webcam and internet connection are working properly.<br></br>

➜ The exam timer will start immediately after clicking Start Exam. <br></br>

➜ Keep your face clearly visible throughout the examination.<br></br>

➜ Do not switch browser tabs, minimize, or refresh the page during the exam. <br></br>

➜ Any suspicious activity will be detected and recorded by the AI Proctoring System. <br></br>

➜ The examination will be submitted automatically when the allotted time expires. <br></br>

➜ Ensure only one person is present in front of the camera.<br></br>

➜ Multiple AI warnings may be reported to the faculty for further review. <br></br>

➜ Click Start Exam only when you are ready to begin the examination. <br></br>

          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {exam.instructions.map((line, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--color-text-secondary)" }}>
                <span style={{ color: "var(--color-primary)" }}>→</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExamInstructions;