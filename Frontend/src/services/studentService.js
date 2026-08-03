import api from "./authService";

/**getStudentExams */
export const getStudentExams = async () => {
    const { data } = await api.get("/student/upcoming-exams/");

    return data.map((exam) => ({
        id: exam.id,
        title: exam.title,
        subject: exam.subject,
        duration: exam.duration,
        totalMarks: exam.total_marks,
        startTime: exam.start_time,
        status: exam.status,
    }));
};

/**getStudentStats*/
export const getStudentStats = async () => {
    const { data } = await api.get("/student/dashboard/");
    return {
        totalExams: data.total_exams,
        completedExams: data.completed_exams,
        averageScore: data.average_score,
    };
};

/**Notification*/
export const getNotifications = async () => {
    const { data } = await api.get("/student/notifications/");
    return data;
};

/**RecentResult */
export const getRecentResults = async () => {
    const { data } = await api.get("/student/recent-results/");
    return data;
};

export const markNotificationRead = async (id) => {
    const { data } = await api.post(`/results/notifications/mark-read/${id}/`);
    return data;
};

export const markAllNotificationsRead = async () => {
    const { data } = await api.post(`/results/notifications/mark-all-read/`);
    return data;
};