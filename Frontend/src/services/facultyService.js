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
 * GET /api/faculty/exams/ — this faculty's own exams, with question
 * counts already attached server-side.
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
 * GET /api/faculty/dashboard/ — total exams, questions, upcoming exams
 * for the logged-in faculty. Falls back to computing from
 * getFacultyExams() if the dashboard endpoint isn't available yet.
 */
export const getFacultyStats = async () => {

    try {

        const { data } = await api.get("/faculty/dashboard/");

        return {
            totalExams: data.total_exams ?? 0,
            totalQuestions: data.total_questions ?? 0,
            upcomingExams: data.upcoming_exams ?? 0,
        };

    }

    catch {

        const exams = await getFacultyExams();

        const totalQuestions = exams.reduce((sum, e) => sum + (e.questionCount ?? 0), 0);

        const upcomingExams = exams.filter(
            (e) => e.status !== "completed" && e.status !== "closed"
        ).length;

        return {
            totalExams: exams.length,
            totalQuestions,
            upcomingExams,
        };

    }

};


export const createExam = async (examData) => {

    const { data } = await api.post("/exams/create/", examData);

    return data;

};

export const updateExam = async (examId, examData) => {

    const { data } = await api.put(`/exams/update/${examId}/`, examData);

    return data;

};

export const deleteExam = async (examId) => {

    const { data } = await api.delete(`/exams/delete/${examId}/`);

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


export const deleteQuestion = async (questionId) => {
    const response = await api.delete(`/questions/delete/${questionId}/`);
    return response.data;
};