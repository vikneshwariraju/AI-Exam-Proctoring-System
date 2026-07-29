import api from "./authService";
import { getFacultyExams } from "./facultyService";

/**Exam result */
const getExamResultsList = async (examId) => {
    try {
        const { data } = await api.get(`/results/faculty/exam-results/${examId}/`);
        return Array.isArray(data) ? data : [];
    }
    catch {
        return [];
    }
};

/**result details*/
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

//publish result
export const publishResult = async (resultId) => {
    const { data } = await api.post(`/results/publish/${resultId}/`);
    return data;
};

//publish all result
export const publishAllResults = async (examId) => {
    const { data } = await api.post(`/results/publish-all/${examId}/`);
    return data;
};