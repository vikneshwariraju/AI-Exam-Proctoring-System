import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getExamDetails,
  getExamQuestions,
  submitAnswer,
  finalizeExam,
} from "../../services/examService";
import { logWarning } from "../../services/aiService";

import Timer from "../../components/exam/Timer";
import QuestionCard from "../../components/exam/QuestionCard";
import QuestionPalette from "../../components/exam/QuestionPalette";
import SubmitModal from "../../components/exam/SubmitModal";
import WebcamProctor from "../../components/exam/WebcamProctor";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

const AttendExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Load Exam
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadError("");

      try {
  // Ask for camera permission first
  console.log("Requesting camera...");
  await navigator.mediaDevices.getUserMedia({ video: true });

  // Camera verified, now call backend
  const [examDetails, startData] = await Promise.all([
    getExamDetails(examId),
    getExamQuestions(examId),
  ]);

  if (cancelled) return;

  if (!examDetails) {
    setLoadError("Exam not found.");
    return;
  }

  if (!startData?.questions || startData.questions.length === 0) {
    setLoadError("No questions found.");
    return;
  }

  setExam(examDetails);
  setQuestions(startData.questions);
  console.log("Start Exam API:", startData);
  setRemainingSeconds(
    startData.remaining_seconds ?? startData.duration * 60
);

} catch (err) {
  if (cancelled) return;

  console.error(err);

  if (err.name === "NotAllowedError") {
    setLoadError("Camera permission is required to start the exam.");
  } else {
    setLoadError(
      err.response?.data?.error ||
      err.response?.data?.detail ||
      "Unable to load exam."
    );
  }
} finally {
  if (!cancelled) setLoading(false);
}
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [examId]);

  // AI Tab Switch Detection
  useEffect(() => {
    let warningSent = false;

    const handleTabSwitch = async () => {
      if (warningSent) return;

      warningSent = true;

      try {
        const response = await logWarning(examId, "tab_switch");

        console.log("Warning Logged:", response);

        if (response.flagged) {
          alert(`Warning limit exceeded due to repeated: ${response.warning_type}. Faculty has been notified.`);
        }
      } catch (err) {
        console.error("Warning failed:", err);
      }

      setTimeout(() => {
        warningSent = false;
      }, 3000);
    };

    window.addEventListener("blur", handleTabSwitch);

    return () => {
      window.removeEventListener("blur", handleTabSwitch);
    };
  }, [examId]);

  if (loading) {
    return (
      <div style={{ padding: 60 }}>
        <Loader label="Loading Exam..." />
      </div>
    );
  }

  if (loadError || !exam || questions.length === 0) {
    return (
      <div
        style={{
          padding: 60,
          maxWidth: 500,
          margin: "0 auto",
        }}
      >
        <div className="card" style={{ padding: 24, color: "red" }}>
          {loadError}
        </div>

        <button
          className="btn-secondary-brand mt-3"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSelect = (optionIndex) => {
    // Update the UI immediately...
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));

    // ...and sync to the backend in the background on every change, so
    // progress survives a closed tab/crash instead of only being saved
    // at the very end.
    submitAnswer(examId, currentQuestion.id, optionIndex).catch((err) => {
      console.error("Failed to save answer:", err.response?.data || err);
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // Answers were already synced to the backend as they were selected
      // (see handleSelect), so finalizing just triggers grading and
      // fetches the result.
      const result = await finalizeExam(examId);

      navigate(`/student/results/${examId}`, {
        state: result,
      });
    } catch (err) {
      console.error(err);

      setLoadError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Failed to submit exam."
      );

      setSubmitting(false);
    }
  };

  const durationMinutes = remainingSeconds != null ? remainingSeconds / 60 : exam.duration;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div
        style={{
          height: 60,
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          borderBottom: "1px solid #ddd",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <h5 style={{ margin: 0 }}>{exam.title}</h5>

        <Timer
          durationMinutes={remainingSeconds}
          onTimeUp={handleSubmit}
        />
      </div>

      <div
        className="container-fluid"
        style={{  minHeight: "85vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px", }}
      >
        <div className="row g-3">
          <div className="col-12 col-lg-8">
            <QuestionCard
              question={currentQuestion}
              index={currentIndex}
              total={questions.length}
              selectedIndex={answers[currentQuestion.id]}
              onSelect={handleSelect}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Button
                variant="secondary"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => i - 1)}
              >
                Previous
              </Button>

              {currentIndex === questions.length - 1 ? (
                <Button onClick={() => setShowSubmitModal(true)}>
                  Submit
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentIndex((i) => i + 1)}
                >
                  Next
                </Button>
              )}
            </div>
          </div>

          <div className="col-12 col-lg-4 d-flex flex-column gap-3">
            <WebcamProctor examId={examId} />

            <QuestionPalette
              questions={questions}
              answers={answers}
              currentIndex={currentIndex}
              onJump={setCurrentIndex}
              onSubmit={() => setShowSubmitModal(true)}
            />
          </div>
        </div>
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
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader label="Submitting..." />
        </div>
      )}
    </div>
  );
};

export default AttendExam;