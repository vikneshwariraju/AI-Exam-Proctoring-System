import api from "./authService";

/**
 * There's no dedicated exam-details endpoint, same situation as the
 * student side. Field names are guesses — paste a real
 * GET /api/exams/list/ response and I'll correct these.
 */
const normalizeExam = (exam) => ({
    id: exam.id,
    title: exam.title ?? exam.name ?? "Untitled Exam",
    subject: exam.subject ?? exam.subject_name ?? "",
    duration: exam.duration ?? exam.duration_minutes ?? 0,
    totalMarks: exam.totalMarks ?? exam.total_marks ?? 0,
    status: exam.status ?? "published",
    createdBy: exam.created_by ?? exam.faculty ?? exam.faculty_id ?? null,
    raw: exam
});

/**
 * GET /api/exams/list/ has no faculty-specific filtering built in, so it
 * returns ALL exams from every faculty member. If exam objects carry a
 * created_by / faculty field, we filter to just this logged-in faculty's
 * exams; if that field doesn't exist, we can't tell them apart and show
 * everything instead (see `showingAllExams` flag returned alongside).
 *
 * Also fetches each exam's question count via
 * GET /api/questions/list/<exam_id>/ (N+1 calls — there's no bulk-count
 * endpoint, same limitation seen elsewhere in this API).
 */
export const getFacultyExams = async () => {
    const { data } = await api.get("/faculty/exams/");

    return data.map((exam) => ({
        id: exam.id,
        title: exam.title,
        subject: exam.subject,
        duration: exam.duration,
        totalMarks: exam.total_marks,
        questionCount: exam.question_count,
        status: exam.status,
    }));
};

/**
 * No aggregate stats endpoint exists — computed client-side from
 * getFacultyExams() above.
 */
export const getFacultyStats = async (facultyUserId) => {

    const exams = await getFacultyExams(facultyUserId);

    const totalQuestions = exams.reduce((sum, e) => sum + (e.questionCount ?? 0), 0);

    const upcomingExams = exams.filter(
        (e) => e.status !== "completed" && e.status !== "closed"
    ).length;

    return {
        totalExams: exams.length,
        totalQuestions,
        upcomingExams,
        showingAllExams: exams.showingAllExams
    };

};


export const createExam = async (examData) => {

    const { data } = await api.post("/exams/create/", examData);

    return data;

};

export const getExamQuestionsList = async (examId) => {

    const { data } = await api.get(`/questions/list/${examId}/`);

    return data;

};

export const addQuestion = async (examId, questionData) => {

    const { data } = await api.post("/questions/add/", { exam: examId, ...questionData });

    return data;

};

export const updateQuestion = async (questionId, data) => {
    const response = await api.put(
        `/questions/update/${questionId}/`,
        data
    );
    return response.data;
};