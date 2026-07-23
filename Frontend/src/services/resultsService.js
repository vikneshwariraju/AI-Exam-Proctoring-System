import api from "./authService";
import { getFacultyExams } from "./facultyService";

/**
 * GET /api/analytics/exam-analytics/<exam_id>/ — "Faculty's class-wide
 * analytics". This is the only endpoint that could plausibly return
 * every student's result for a given exam — there's no generic
 * "all results" endpoint on the backend.
 *
 * NOTE: response shape is completely unconfirmed. This normalizes
 * flexibly (tries .results, .students, or a raw array) but the actual
 * field names per row are a guess. Paste one real response and I'll
 * correct this in one place.
 */
const getExamAnalytics = async (examId) => {

    try {

        const { data } = await api.get(`/analytics/exam-analytics/${examId}/`);

        return Array.isArray(data) ? data : (data?.results ?? data?.students ?? []);

    }

    catch {

        return [];

    }

};

/**
 * No single "all results across all exams" endpoint exists, so this:
 * 1. gets this faculty's exams (via facultyService, already built)
 * 2. calls exam-analytics for each one
 * 3. flattens into one list + computes summary stats
 *
 * Returns { stats, results } together so the page only needs one call
 * instead of duplicating the exam-fetch and analytics-fetch work twice.
 */
export const getFacultyResultsData = async (facultyUserId) => {

    const exams = await getFacultyExams(facultyUserId);

    const perExamResults = await Promise.all(
        exams.map(async (exam) => {

            const rows = await getExamAnalytics(exam.id);

            return rows.map((row, i) => {

                const score = row.score ?? row.marks_obtained ?? 0;
                const total = row.totalMarks ?? row.total_marks ?? exam.totalMarks ?? 0;
                const percentage = total > 0 ? Math.round((score / total) * 100) : (row.percentage ?? 0);

                return {
                    id: row.id ?? `${exam.id}-${i}`,
                    student: row.student ?? row.student_name ?? row.name ?? "Unknown",
                    exam: exam.title,
                    date: row.date ?? row.submitted_at ?? "-",
                    result: percentage >= 40 ? "passed" : "failed",
                    score: total > 0 ? `${score}/${total}` : `${score}`,
                    timeSpent: row.timeSpent ?? row.time_spent ?? "-"
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