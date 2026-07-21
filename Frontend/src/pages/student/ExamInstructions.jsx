import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamDetails } from "../../services/examService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { ArrowLeft, FileText } from "lucide-react";

const ExamInstructions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    getExamDetails(examId).then(setExam);
  }, [examId]);

  if (!exam) {
    return <DashboardLayout activeItem="Available Exams"><Loader /></DashboardLayout>;
  }

  return (
    <DashboardLayout activeItem="Available Exams">
      <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", marginBottom: 18 }}>
        <ArrowLeft size={15} /> Back to dashboard
      </button>

      <div className="card" style={{ padding: 32, maxWidth: 620 }}>
        <FileText size={26} color="var(--color-primary)" />
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 20, margin: "14px 0 6px" }}>{exam.title}</h1>
        <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)" }}>{exam.description}</p>

        <div style={{ display: "flex", gap: 24, margin: "20px 0", fontSize: 13 }}>
          <div><b>Duration:</b> {exam.duration} min</div>
          <div><b>Marks:</b> {exam.totalMarks}</div>
          <div><b>Deadline:</b> {exam.deadline}</div>
        </div>

        <Button onClick={() => navigate(`/student/exams/${examId}/attend`)}>Let's start the exam</Button>

        <hr style={{ margin: "26px 0", border: "none", borderTop: "1px solid var(--color-border)" }} />

        <h4 style={{ fontSize: 14, marginBottom: 10 }}>Instructions</h4>
        <ul style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.9, paddingLeft: 18 }}>
          {exam.instructions.map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default ExamInstructions;