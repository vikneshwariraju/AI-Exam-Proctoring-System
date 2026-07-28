import api from "./authService";

/**
 * POST /api/users/create-faculty/ — admin-only, via IsAdmin permission.
 */
export const createFaculty = async (formData) => {

    const { data } = await api.post("/users/create-faculty/", formData);

    return { ...data, status: "active" };

};

/**
 * GET /api/admin/dashboard/ — Total students, faculty, active exams,
 * flagged alerts. Falls back gracefully (null/empty) if the endpoint
 * errors so the UI can show "—" instead of crashing.
 */
export const getDashboardStats = async () => {

    try {

        const { data } = await api.get("/admin/dashboard/");

        return {
            totalStudents: data.total_students ?? 0,
            totalFaculty: data.total_faculty ?? 0,
            activeExams: data.active_exams ?? data.total_exams ?? 0,
            flaggedAlerts: data.flagged_alerts ?? 0,
            statsEndpointMissing: false
        };

    }

    catch {

        return {
            totalStudents: null,
            totalFaculty: null,
            activeExams: null,
            flaggedAlerts: null,
            statsEndpointMissing: true
        };

    }

};

/** GET /api/admin/students/ — list all students */
export const getAllStudents = async () => {

    try {

        const { data } = await api.get("/admin/students/");

        return (Array.isArray(data) ? data : []).map((u) => ({
            ...u,
            status: u.is_active === false ? "inactive" : "active"
        }));

    }

    catch {

        return [];

    }

};

/** GET /api/admin/faculty/ — list all faculty */
export const getAllFaculty = async () => {

    try {

        const { data } = await api.get("/admin/faculty/");

        return (Array.isArray(data) ? data : []).map((u) => ({
            ...u,
            status: u.is_active === false ? "inactive" : "active"
        }));

    }

    catch {

        return [];

    }

};

/** GET /api/admin/exams/ — all exams with faculty name attached */
export const getAllExams = async () => {

    try {

        const { data } = await api.get("/admin/exams/");

        return Array.isArray(data) ? data.map((exam) => ({
            id: exam.id,
            title: exam.title ?? exam.name ?? "Untitled Exam",
            facultyName: exam.faculty_name ?? exam.faculty ?? exam.created_by ?? "Unknown",
            totalMarks: exam.totalMarks ?? exam.total_marks ?? 0,
            startTime: exam.start_time ?? exam.startTime ?? null,
            endTime: exam.end_time ?? exam.endTime ?? null,
        })) : [];

    }

    catch {

        return [];

    }

};