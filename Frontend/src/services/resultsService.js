import api from "./authService";
import { getFacultyExams } from "./facultyService";

/**
 * GET /api/results/faculty/exam-results/<exam_id>/ — FacultyViewExamResultsView.
 * Returns one row PER STUDENT for this exam: { result_id, student_id,
 * student_name, marks, percentage, published }.
 *
 * NOTE: this used to call /api/analytics/exam-analytics/<exam_id>/ instead,
 * which is a completely different endpoint — it returns one AGGREGATE
 * object for the whole class (average/highest/lowest marks), not a
 * per-student array. That mismatch was silently producing an empty
 * results list every time, even when real (unpublished) results existed.
 */
const getExamResultsList = async (examId) => {

    try {

        const { data } = await api.get(`/results/faculty/exam-results/${examId}/`);

        return Array.isArray(data) ? data : [];

    }

    catch {

        return [];

    }

};

/**
 * 1. gets this faculty's exams (via facultyService, already built)
 * 2. calls the per-student results endpoint for each one
 * 3. flattens into one list + computes summary stats
 */
export const getFacultyResultsData = async (facultyUserId) => {

    const exams = await getFacultyExams(facultyUserId);

    const perExamResults = await Promise.all(
        exams.map(async (exam) => {

            const rows = await getExamResultsList(exam.id);

            return rows.map((row) => {

                const marks = row.marks ?? 0;
                const percentage = row.percentage ?? 0;

                return {
                    id: row.result_id,
                    examId: exam.id,
                    student: row.student_name ?? "Unknown",
                    exam: exam.title,
                    date: row.date ?? row.submitted_at ?? "-",
                    result: percentage >= 40 ? "passed" : "failed",
                    score: exam.totalMarks ? `${marks}/${exam.totalMarks}` : `${marks}`,
                    timeSpent: row.timeSpent ?? row.time_spent ?? "-",
                    isPublished: row.published ?? false,
                };

            });

        })
    );

    const results = perExamResults.flat();

    const uniqueStudents = new Set(results.map((r) => r.student));
    const passedCount = results.filter((r) => r.result === "passed").length;
    const failedCount = results.filter((r) => r.result === "failed").length;

    return {
        stats: {
            totalStudents: uniqueStudents.size,
            totalExams: exams.length,
            passedCount,
            failedCount
        },
        results
    };

};

/**
 * POST /api/results/publish/<result_id>/
 * Publishes a single student's result.
 */
export const publishResult = async (resultId) => {
    const { data } = await api.post(`/results/publish/${resultId}/`);
    return data;
};

/**
 * POST /api/results/publish-all/<exam_id>/
 * Publishes every result for a given exam in one call.
 */
export const publishAllResults = async (examId) => {
    const { data } = await api.post(`/results/publish-all/${examId}/`);
    return data;
};