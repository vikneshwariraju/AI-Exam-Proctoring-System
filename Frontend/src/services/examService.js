import api from "./authService";

/**Exam details */
export const getExamDetails = async (examId) => {

    const { data } = await api.get("/exams/list/");

    const exam = Array.isArray(data)
        ? data.find((e) => String(e.id) === String(examId))
        : null;

    if (!exam) {
        return null;
    }

    return {
        id: exam.id,
        title: exam.title ?? exam.name ?? "Untitled Exam",
        description: exam.description ?? "",
        duration: exam.duration ?? exam.duration_minutes ?? 0,
        totalMarks: exam.totalMarks ?? exam.total_marks ?? 0,
        deadline: exam.deadline ?? exam.end_time ?? "",
        instructions: Array.isArray(exam.instructions) ? exam.instructions : []
    };

};

/**
 * GET /api/submissions/start/<exam_id>/
 * "Student starts exam (get questions)". Normalizes to a flat questions
 * array either way (some backends wrap it as { questions: [...] },
 * others return the array directly).
 */
export const getExamQuestions = async (examId) => {
  const { data } = await api.get(`/submissions/start/${examId}/`);

  const rawQuestions = Array.isArray(data)
    ? data
    : data.questions || [];

  return rawQuestions.map((q) => ({
    id: q.id,

    text:
      q.text ||
      q.question_text ||
      q.question ||
      "",

    options:
      q.options ||
      q.choices ||
      [
        q.option1,
        q.option2,
        q.option3,
        q.option4,
      ].filter(Boolean) ||
      [
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
      ].filter(Boolean),

    // Was missing entirely before, which forced every question to show
    // the hardcoded "1 Mark" fallback in QuestionCard.
    marks: q.marks ?? q.mark ?? 1,

    // Only present on a result-review fetch, not during a live exam
    // (a live exam's own endpoint should never leak the answer key).
    correctIndex: q.correctIndex ?? q.correct_index ?? undefined,
  }));
};

/**
 * Submits one answer at a time (POST /api/submissions/submit/), then
 * triggers grading via POST /api/results/calculate/<exam_id>/, then
 * fetches the final score.
 */
export const submitExam = async (examId, answers) => {

    const questionIds = Object.keys(answers);

    await Promise.all(
        questionIds.map((questionId) =>
            api.post("/submissions/submit/", {
                exam: examId,
                question: questionId,
                selected_option: answers[questionId]
            })
        )
    );

    await api.post(`/results/calculate/${examId}/`);

    const { data } = await api.get(`/results/view/${examId}/`);

    return data;

};

/**
 * GET /api/results/view/<exam_id>/
 * Used as a fallback when the page is opened directly (e.g. refreshed)
 * instead of via in-app navigation state. Returns null (not published
 * yet) rather than throwing, so the results page can show a clear
 * "not published yet" message instead of a raw error.
 */
export const getExamResult = async (examId) => {

    try {
        const { data } = await api.get(`/results/view/${examId}/`);
        return data;
    } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 404) {
            return null;
        }
        throw err;
    }

};

/**
 * GET /api/analytics/student-performance/<exam_id>/
 * PER-EXAM — there is no endpoint that aggregates performance across
 * every exam a student has taken.
 *
 * Backend only tracks difficulty (easy/medium/hard) per question, not
 * topics — there is no topic concept anywhere in the data model, so
 * this doesn't pretend a topicBreakdown exists. difficulty_breakdown
 * comes back as an OBJECT keyed by difficulty; converted to an array
 * here so it's easy to map over for a chart.
 */
export const getStudentPerformance = async (examId) => {

    const { data } = await api.get(`/analytics/student-performance/${examId}/`);

    const order = ["easy", "medium", "hard"];
    const breakdown = data?.difficulty_breakdown || {};

    const difficultyBreakdown = order
        .filter((diff) => breakdown[diff])
        .map((diff) => ({
            difficulty: diff,
            total: breakdown[diff].total ?? 0,
            correct: breakdown[diff].correct ?? 0,
            accuracy: breakdown[diff].accuracy ?? null,
        }));

    return {
        examId: data?.exam_id,
        examTitle: data?.exam_title,
        marks: data?.marks ?? null,
        percentage: data?.percentage ?? null,
        difficultyBreakdown,
        weakAreas: Array.isArray(data?.weak_areas) ? data.weak_areas : [],
    };

};