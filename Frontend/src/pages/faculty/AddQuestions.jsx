import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Pencil, X } from "lucide-react";
import { addQuestion, getExamQuestionsList, updateQuestion } from "../../services/facultyService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";

const AddQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rawError, setRawError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    getExamQuestionsList(examId)
      .then((data) => setQuestions(Array.isArray(data) ? data : []))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [examId]);

  const onSubmit = async (formData) => {
    setRawError(null);
    setSubmitting(true);

    const payload = {
      question_text: formData.questionText,
      option1: formData.optionA,
      option2: formData.optionB,
      option3: formData.optionC,
      option4: formData.optionD,
      answer: formData.correctOption,
      marks: Number(formData.marks),
    };

    try {
      const newQuestion = await addQuestion(examId, payload);
      setQuestions((prev) => [...prev, newQuestion]);
      reset();
    } catch (err) {
      setRawError(err.response?.data || { error: "Something went wrong. Check the console." });
      console.error("Add question error:", err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (q) => {
    setEditingId(q.id);
    setEditError(null);
    setEditForm({
      question_text: q.question_text ?? q.text ?? "",
      option1: q.option1 ?? "",
      option2: q.option2 ?? "",
      option3: q.option3 ?? "",
      option4: q.option4 ?? "",
      answer: q.answer ?? "",
      marks: q.marks ?? "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
    setEditError(null);
  };

  const saveEdit = async (questionId) => {
    setEditSubmitting(true);
    setEditError(null);

    try {
      const updated = await updateQuestion(questionId, {
        ...editForm,
        marks: Number(editForm.marks),
      });
      setQuestions((prev) => prev.map((q) => (q.id === questionId ? updated : q)));
      cancelEditing();
    } catch (err) {
      if (err.response?.status === 404) {
        setEditError(
          "This backend doesn't have a question-edit endpoint yet — ask your friend to add PATCH /api/questions/edit/<id>/."
        );
      } else {
        setEditError(
          Object.entries(err.response?.data || {})
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
            .join(" | ") || "Failed to update question."
        );
      }
    } finally {
      setEditSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeItem="Manage Exams">
        <Loader label="Loading questions..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="Manage Exams">
      <button
        onClick={() => navigate("/faculty/dashboard")}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", marginBottom: 18 }}
      >
        <ArrowLeft size={15} /> Back to dashboard
      </button>

      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 6, color: "var(--color-text-primary)" }}>
        Manage Questions
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", marginBottom: 24 }}>
        {questions.length} question{questions.length !== 1 ? "s" : ""} added so far.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

        {/* Existing questions list */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 14, color: "var(--color-text-primary)" }}>
            Questions
          </h3>

          {questions.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>No questions added yet.</p>
          )}

          {questions.map((q, i) => (
            <div key={q.id ?? i} className="row-hover" style={{ padding: "10px 8px", borderBottom: "1px solid var(--color-border)" }}>

              {editingId === q.id ? (
                <div className="d-flex flex-column gap-2">
                  {editError && (
                    <div style={{ background: "#FEF2F2", color: "#B91C1C", padding: 8, borderRadius: 8, fontSize: 12 }}>
                      {editError}
                    </div>
                  )}

                  <textarea
                    rows={2}
                    style={{ width: "100%", borderRadius: 8, border: "1px solid var(--color-border)", padding: 8, fontSize: 13 }}
                    value={editForm.question_text}
                    onChange={(e) => setEditForm({ ...editForm, question_text: e.target.value })}
                  />

                  {["option1", "option2", "option3", "option4"].map((field, idx) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      style={{ width: "100%", height: 34, borderRadius: 8, border: "1px solid var(--color-border)", padding: "0 8px", fontSize: 13 }}
                      value={editForm[field]}
                      onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                    />
                  ))}

                  <select
                    style={{ width: "100%", height: 34, borderRadius: 8, border: "1px solid var(--color-border)", padding: "0 8px", fontSize: 13 }}
                    value={editForm.answer}
                    onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                  >
                    <option value="">Correct option...</option>
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Marks"
                    style={{ width: "100%", height: 34, borderRadius: 8, border: "1px solid var(--color-border)", padding: "0 8px", fontSize: 13 }}
                    value={editForm.marks}
                    onChange={(e) => setEditForm({ ...editForm, marks: e.target.value })}
                  />

                  <div className="d-flex gap-2">
                    <button
                      className="btn-primary-brand"
                      style={{ flex: 1 }}
                      onClick={() => saveEdit(q.id)}
                      disabled={editSubmitting}
                    >
                      {editSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button className="btn-secondary-brand" style={{ flex: 1 }} onClick={cancelEditing}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--color-text-primary)" }}>
                      {i + 1}. {q.question_text ?? q.text ?? "(question text unavailable)"}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
                      Marks: {q.marks ?? "-"}
                    </div>
                  </div>
                  <button
                    className="btn p-1"
                    style={{ color: "var(--color-primary)" }}
                    onClick={() => startEditing(q)}
                    title="Edit question"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add new question form */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 14, color: "var(--color-text-primary)" }}>
            Add a Question
          </h3>

          {rawError && (
            <div style={{ background: "#FEF2F2", color: "#B91C1C", padding: 10, borderRadius: 10, fontSize: 12.5, marginBottom: 14 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Failed — backend said:</div>
              {Object.entries(rawError).map(([field, messages]) => (
                <div key={field}>
                  <b>{field}</b>: {Array.isArray(messages) ? messages.join(", ") : String(messages)}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-2">

            <div>
              <label style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Question Text</label>
              <textarea
                rows={2}
                style={{ width: "100%", borderRadius: 10, border: "1px solid var(--color-border)", padding: 10, fontSize: 13 }}
                {...register("questionText", { required: "Question text is required" })}
              />
              {errors.questionText && <p style={{ color: "#DC2626", fontSize: 12 }}>{errors.questionText.message}</p>}
            </div>

            {["optionA", "optionB", "optionC", "optionD"].map((field, i) => (
              <div key={field}>
                <label style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                  Option {String.fromCharCode(65 + i)}
                </label>
                <input
                  type="text"
                  style={{ width: "100%", height: 38, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 10px", fontSize: 13 }}
                  {...register(field, { required: "Required" })}
                />
              </div>
            ))}

            <div>
              <label style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Correct Option</label>
              <select
                style={{ width: "100%", height: 38, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 10px", fontSize: 13 }}
                {...register("correctOption", { required: "Select the correct option" })}
              >
                <option value="">Select...</option>
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
              {errors.correctOption && <p style={{ color: "#DC2626", fontSize: 12 }}>{errors.correctOption.message}</p>}
            </div>

            <div>
              <label style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Marks</label>
              <input
                type="number"
                style={{ width: "100%", height: 38, borderRadius: 10, border: "1px solid var(--color-border)", padding: "0 10px", fontSize: 13 }}
                {...register("marks", { required: "Marks required", min: { value: 1, message: "At least 1" } })}
              />
              {errors.marks && <p style={{ color: "#DC2626", fontSize: 12 }}>{errors.marks.message}</p>}
            </div>

            <button type="submit" className="btn-primary-brand d-flex align-items-center justify-content-center gap-2 mt-2" disabled={submitting}>
              <Plus size={15} /> {submitting ? "Adding..." : "Add Question"}
            </button>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AddQuestions;