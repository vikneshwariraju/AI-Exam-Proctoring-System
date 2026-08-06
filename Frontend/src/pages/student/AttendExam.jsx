import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getExamDetails,
  getExamQuestions,
  getSavedAnswers,
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

// Backend stores each question's correct answer as a letter (A/B/C/D), so
// submissions must be sent as letters too -- not the 0-based option index
// -- or every answer gets marked wrong regardless of what was picked.
const OPTION_LETTERS = ["A", "B", "C", "D"];
const indexToLetter = (index) => OPTION_LETTERS[index] ?? index;
const letterToIndex = (value) => {
  if (typeof value === "string" && OPTION_LETTERS.includes(value.toUpperCase())) {
    return OPTION_LETTERS.indexOf(value.toUpperCase());
  }
  const n = Number(value);
  return Number.isNaN(n) ? value : n;
};

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

  // Guards against StartExamView being hit twice for the same visit --
  // e.g. React StrictMode's dev-only double-invoke of effects. That
  // endpoint isn't a read-only GET (it creates the ExamAttempt row on
  // first call), so firing it twice looks identical to a real "student
  // left and came back" re-entry to the backend, and gets wrongly blocked.
  //
  // NOTE: this ref alone is the guard. We deliberately do NOT pair it
  // with a "cancelled" flag from the effect's cleanup -- StrictMode's
  // synthetic unmount would set cancelled=true on the *one* run that
  // actually did the work, before its async calls resolve, and the
  // second run (whose cleanup never fires) bails out immediately via
  // the ref check without ever calling load(). That combo was what froze
  // the page on "Loading Exam..." forever.
  const hasStartedRef = useRef(false);

  // Load Exam
  useEffect(() => {
    const load = async () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      setLoading(true);
      setLoadError("");

      try {
        // Ask for camera permission first, and make sure to stop the
        // preview stream once confirmed -- otherwise it stays locked and
        // can conflict with WebcamProctor opening the camera right after.
        console.log("Requesting camera...");
        const previewStream = await navigator.mediaDevices.getUserMedia({ video: true });
        previewStream.getTracks().forEach((track) => track.stop());

        // Camera verified, now call backend
        const [examDetails, startData, savedAnswers] = await Promise.all([
          getExamDetails(examId),
          getExamQuestions(examId),
          getSavedAnswers(examId), // safe: resolves to {} if not implemented/available
        ]);

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
          startData.remainingSeconds ?? startData.duration * 60
        );

        if (savedAnswers && typeof savedAnswers === "object") {
          const restored = {};
          Object.entries(savedAnswers).forEach(([questionId, selectedOption]) => {
            restored[questionId] = letterToIndex(selectedOption);
          });
          setAnswers(restored);
        }
      } catch (err) {
        console.error(err);

        // A genuine re-entry attempt from the backend still needs to be
        // shown as-is, but a call that never actually reached the backend
        // (e.g. camera permission denial) shouldn't get lumped in with it.
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
        setLoading(false);
      }
    };

    load();
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
          alert("Warning limit exceeded due to repeated tab switching. Faculty has been notified.");
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

    // ...and sync to the backend as a letter (A/B/C/D), matching how the
    // correct answer is stored, so grading actually works.
    const selectedLetter = indexToLetter(optionIndex);
    submitAnswer(examId, currentQuestion.id, selectedLetter).catch((err) => {
      console.error("Failed to save answer:", err.response?.data || err);
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;
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
          initialSeconds={remainingSeconds}
          onTimeUp={handleSubmit}
        />
      </div>

      <div
        className="container-fluid"
        style={{ maxWidth: 1100, margin: "30px auto", padding: "0 20px 60px" }}
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
                <Button onClick={() => setShowSubmitModal(true)} disabled={submitting}>
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