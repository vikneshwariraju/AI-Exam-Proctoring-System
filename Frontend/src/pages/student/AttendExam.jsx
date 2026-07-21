import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamDetails, getExamQuestions, submitExam } from "../../services/examService";
import Timer from "../../components/exam/Timer";
import QuestionCard from "../../components/exam/QuestionCard";
import QuestionPalette from "../../components/exam/QuestionPalette";
import SubmitModal from "../../components/exam/SubmitModal";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

const AttendExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getExamDetails(examId), getExamQuestions(examId)]).then(([e, q]) => {
      setExam(e);
      setQuestions(q);
    });
  }, [examId]);

  if (!exam || questions.length === 0) {
    return <div style={{ padding: 60 }}><Loader label="Loading exam..." /></div>;
  }

  const currentQuestion = questions[currentIndex];

  const handleSelect = (optionIndex) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const result = await submitExam(examId, answers);
    setSubmitting(false);
    navigate(`/student/results/${examId}`, { state: result });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <div style={{
        height: 58, background: "#fff", borderBottom: "1px solid var(--color-border)",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px",
      }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{exam.title}</div>
        <Timer durationMinutes={exam.duration} onTimeUp={handleSubmit} />
      </div>

      <div style={{ maxWidth: 1000, margin: "28px auto", padding: "0 24px", display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: 20 }}>
        <div>
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            total={questions.length}
            selectedIndex={answers[currentQuestion.id]}
            onSelect={handleSelect}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <Button variant="secondary" disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => i - 1)}>
              Previous
            </Button>
            {currentIndex < questions.length - 1 ? (
              <Button onClick={() => setCurrentIndex((i) => i + 1)}>Next</Button>
            ) : (
              <Button onClick={() => setShowSubmitModal(true)}>Review &amp; Submit</Button>
            )}
          </div>
        </div>

        <QuestionPalette
          questions={questions}
          answers={answers}
          currentIndex={currentIndex}
          onJump={setCurrentIndex}
        />
      </div>

      {showSubmitModal && (
        <SubmitModal
          answeredCount={Object.keys(answers).length}
          totalCount={questions.length}
          onCancel={() => setShowSubmitModal(false)}
          onConfirm={handleSubmit}
        />
      )}

      {submitting && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 400 }}>
          <Loader label="Submitting your exam..." />
        </div>
      )}
    </div>
  );
};

export default AttendExam;