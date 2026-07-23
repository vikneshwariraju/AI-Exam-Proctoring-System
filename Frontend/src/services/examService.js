import api from "./authService";

/**Exam details */
export const getExamDetails = async (examId) => {

    const { data } = await api.get("/exams/list/");

    const exam = Array.isArray(data)
        ? data.find((e) => String(e.id) === String(examId))
        : null;

    if (!exam) {
        // Return null instead of throwing — lets the calling page show a
        // clear "not found" message instead of an infinite spinner if the
        // .then()/.catch() chain doesn't handle a rejected promise.
        return null;
    }

    return {
        id: exam.id,
        title: exam.title ?? exam.name ?? "Untitled Exam",
        description: exam.description ?? "",
        duration: exam.duration ?? exam.duration_minutes ?? 0,
        totalMarks: exam.totalMarks ?? exam.total_marks ?? 0,
        deadline: exam.deadline ?? exam.end_time ?? "",
        // guessing there's no instructions field yet — default to empty
        // so `.map()` in ExamInstructions.jsx doesn't crash
        instructions: Array.isArray(exam.instructions) ? exam.instructions : []
    };

};

/**
 * GET /api/submissions/start/<exam_id>/
 * "Student starts exam (get questions)". Response shape is unconfirmed —
 * normalizes to a flat questions array either way (some backends wrap
 * it as { questions: [...] }, others return the array directly).
 *
 * NOTE: question field names (text/options) are guesses. Paste a real
 * response and I'll correct these + tell QuestionCard exactly what to render.
 */
export const getExamQuestions = async (examId) => {

    const { data } = await api.get(`/submissions/start/${examId}/`);

    const rawQuestions = Array.isArray(data) ? data : (data?.questions ?? []);

    return rawQuestions.map((q) => ({
        id: q.id,
        text: q.text ?? q.question_text ?? q.question ?? "",
        options: q.options ?? q.choices ?? []
    }));

};

/**
 * Her API submits ONE answer at a time (POST /api/submissions/submit/),
 * not a single bulk payload. So this loops through every answered
 * question and submits each individually, then triggers grading via
 * POST /api/results/calculate/<exam_id>/, then fetches the final score.
 *
 * NOTE: the payload field names (exam, question, selected_option) are
 * guesses — confirm the exact field names her SubmissionSerializer
 * expects and I'll correct this in one place.
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
 * Used by ResultDetails.jsx as a fallback when the page is opened
 * directly (e.g. refreshed) instead of via in-app navigation state.
 */
export const getExamResult = async (examId) => {

    const { data } = await api.get(`/results/view/${examId}/`);

    return data;

};

/**
 * GET /api/analytics/student-performance/<exam_id>/
 * This is PER-EXAM — there is no endpoint that aggregates performance
 * across every exam a student has taken. Performance.jsx has been
 * rewritten to loop over completed exams and call this once per exam.
 *
 * NOTE: topicBreakdown/difficultyBreakdown shape is a guess — paste a
 * real response and I'll correct this.
 */
export const getStudentPerformance = async (examId) => {

    const { data } = await api.get(`/analytics/student-performance/${examId}/`);

    return {
        topicBreakdown: Array.isArray(data?.topicBreakdown) ? data.topicBreakdown : [],
        difficultyBreakdown: Array.isArray(data?.difficultyBreakdown) ? data.difficultyBreakdown : []
    };

};