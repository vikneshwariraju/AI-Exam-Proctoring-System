import api from "./authService";

/**create faculty*/
export const createFaculty = async (formData) => {
    const { data } = await api.post("/users/create-faculty/", formData);
    return { ...data, status: "active" };
};

/**User stats (admin only) — total_admins/total_users aren't covered by
 * /admin/dashboard/, so this is a separate call. */
export const getUserStats = async () => {
    try {
        const { data } = await api.get("/users/stats/");
        return {
            totalStudents: data.total_students ?? 0,
            totalFaculty: data.total_faculty ?? 0,
            totalAdmins: data.total_admins ?? 0,
            totalUsers: data.total_users ?? 0,
        };
    }
    catch {
        return {
            totalStudents: null,
            totalFaculty: null,
            totalAdmins: null,
            totalUsers: null,
        };
    }
};

/**Admin dashboard stats */
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

/**students list*/
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

/**faculty list */
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

/**exam list */
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


export const getFlaggedAlerts = async () => {
    try {
        const { data } = await api.get("/admin/alerts/"); // match your urls.py path
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
};


// adminService.js
export const getExamAnalytics = async (examId) => {
    try {
        const { data } = await api.get(`/analytics/exam-analytics/${examId}/`);
        return data;
    } catch {
        return null;
    }
};