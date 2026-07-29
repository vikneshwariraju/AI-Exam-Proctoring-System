import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createExam, updateExam } from "../../services/facultyService";
import { getExamDetails } from "../../services/examService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";

// Converts an ISO datetime string to the "YYYY-MM-DDTHH:mm" format the
// <input type="datetime-local"> control expects, in the user's local time.
const toDatetimeLocal = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// NOTE: field names below (title, subject, duration, total_marks) are our
// best guess for her Exam serializer. If submission fails, the raw error
// object from Django is shown below the form — that tells us the exact
// field names/types she actually expects, so we can fix this in one place
// instead of guessing again.
const CreateExam = () => {
  const navigate = useNavigate();
  const { examId } = useParams(); // present only on /faculty/exams/edit/:examId
  const isEditMode = Boolean(examId);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [loadingExam, setLoadingExam] = useState(isEditMode);
  const [loadExamError, setLoadExamError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rawError, setRawError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // In edit mode, fetch the existing exam and pre-fill the form.
  useEffect(() => {
    if (!isEditMode) return;

    setLoadingExam(true);
    setLoadExamError("");

    getExamDetails(examId)
      .then((exam) => {
        if (!exam) {
          setLoadExamError("This exam couldn't be found. It may have been removed.");
          return;
        }
        reset({
          title: exam.title ?? "",
          subject: exam.subject ?? "",
          startTime: toDatetimeLocal(exam.startTime ?? exam.start_time),
          endTime: toDatetimeLocal(exam.deadline ?? exam.end_time),
          duration: exam.duration ?? "",
          totalMarks: exam.totalMarks ?? "",
        });
      })
      .catch((err) => {
        setLoadExamError(
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "Could not load this exam's details."
        );
      })
      .finally(() => setLoadingExam(false));
  }, [examId, isEditMode, reset]);

  const onSubmit = async (formData) => {
    setRawError(null);
    setSuccessMsg("");
    setSubmitting(true);

    const payload = {
      title: formData.title,
      subject: formData.subject,
      duration: Number(formData.duration),
      total_marks: Number(formData.totalMarks),
      start_time: new Date(formData.startTime).toISOString(),
      end_time: new Date(formData.endTime).toISOString(),
    };

    try {
      if (isEditMode) {
        await updateExam(examId, payload);
        setSuccessMsg("Exam updated successfully!");
        setTimeout(() => {
          navigate("/faculty/exams");
        }, 1200);
      } else {
        const exam = await createExam(payload);
        setSuccessMsg("Exam created successfully!");
        setTimeout(() => {
          navigate(`/faculty/exams/${exam.id}/questions`);
        }, 1200);
      }
    } catch (err) {
      // Show the FULL raw error object — this is deliberate. Since we
      // don't yet know her exact field names, seeing every key Django
      // rejected (not just one guessed field) is how we fix this fast.
      setRawError(err.response?.data || { error: "Something went wrong. Check the console." });
      console.error(`${isEditMode ? "Update" : "Create"} exam error:`, err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingExam) {
    return (
      <DashboardLayout activeItem="Manage Exams">
        <Loader label="Loading exam details..." />
      </DashboardLayout>
    );
  }

  if (loadExamError) {
    return (
      <DashboardLayout activeItem="Manage Exams">
        <div className="card" style={{ padding: 20, color: "#b91c1c" }}>{loadExamError}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="Manage Exams">
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 6, color: "var(--color-text-primary)" }}>
        {isEditMode ? "Edit Exam" : "Create New Exam"}
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", marginBottom: 24 }}>
        {isEditMode
          ? "Update the exam details below."
          : "Fill in the exam details, then you'll be taken to add questions."}
      </p>

      <div className="card" style={{ padding: 28, maxWidth: 520 }}>

        {successMsg && (
          <div style={{ background: "#ECFDF5", color: "#059669", padding: 12, borderRadius: 10, fontSize: 13.5, marginBottom: 16 }}>
            {successMsg}
          </div>
        )}

        {rawError && (
          <div style={{ background: "#FEF2F2", color: "#B91C1C", padding: 12, borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              {isEditMode ? "Exam update failed" : "Exam creation failed"} — backend said:
            </div>
            {Object.entries(rawError).map(([field, messages]) => (
              <div key={field} style={{ marginBottom: 2 }}>
                <b>{field}</b>: {Array.isArray(messages) ? messages.join(", ") : String(messages)}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">

          <div>
            <label style={{ fontSize: 12.5, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>
              Exam Title
            </label>
            <input
              type="text"
              placeholder="e.g. Midterm Physics Exam"
              style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 12px", fontSize: 13.5 }}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.title.message}</p>}
          </div>

          <div>
            <label style={{ fontSize: 12.5, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>
              Subject
            </label>
            <input
              type="text"
              placeholder="e.g. Physics"
              style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 12px", fontSize: 13.5 }}
              {...register("subject", { required: "Subject is required" })}
            />
            {errors.subject && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.subject.message}</p>}
          </div>

          <div className="d-flex gap-3">
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12.5, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>
                Start Time
              </label>
              <input
                type="datetime-local"
                style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 12px", fontSize: 13.5 }}
                {...register("startTime", { required: "Start time is required" })}
              />
              {errors.startTime && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.startTime.message}</p>}
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12.5, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>
                End Time
              </label>
              <input
                type="datetime-local"
                style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 12px", fontSize: 13.5 }}
                {...register("endTime", {
                  required: "End time is required",
                  validate: (value, values) =>
                    !values.startTime || new Date(value) > new Date(values.startTime) || "End time must be after start time"
                })}
              />
              {errors.endTime && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.endTime.message}</p>}
            </div>
          </div>

          <div className="d-flex gap-3">
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12.5, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>
                Duration (minutes)
              </label>
              <input
                type="number"
                placeholder="60"
                style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 12px", fontSize: 13.5 }}
                {...register("duration", { required: "Duration is required", min: { value: 1, message: "Must be at least 1 minute" } })}
              />
              {errors.duration && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.duration.message}</p>}
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12.5, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>
                Total Marks
              </label>
              <input
                type="number"
                placeholder="50"
                style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 12px", fontSize: 13.5 }}
                {...register("totalMarks", { required: "Total marks is required", min: { value: 1, message: "Must be at least 1" } })}
              />
              {errors.totalMarks && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.totalMarks.message}</p>}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-2">
            <button type="button" className="btn-secondary-brand" onClick={() => navigate("/faculty/dashboard")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-brand" disabled={submitting}>
              {submitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Exam" : "Create Exam")}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateExam;