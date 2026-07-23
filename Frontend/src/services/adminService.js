import api from "./authService";

/**create faculty */
export const createFaculty = async (formData) => {
    const { data } = await api.post("/users/create-faculty/", formData);
    return { ...data, status: "active" };

};

/**dashboard */
export const getDashboardStats = async () => {
  const { data } = await api.get("/admin/dashboard/");

  return {
    totalStudents: data.total_students,
    totalFaculty: data.total_faculty,
    activeExams: data.active_exams,
    flaggedAlerts: data.flagged_alerts,
  };
};

/**student */
export const getAllStudents = async () => {
  const { data } = await api.get("/admin/students/");

  return data.map((student) => ({
    id: student.id,
    name: student.name,
    email: student.email,
    created_at: student.created_at,
  }));
};

/**faculty */
export const getAllFaculty = async () => {
  const { data } = await api.get("/admin/faculty/");

  return data.map((faculty) => ({
    id: faculty.id,
    name: faculty.name,
    email: faculty.email,
    created_at: faculty.created_at,
  }));
};

/**exams */
export const getAllExams = async () => {
  const { data } = await api.get("/admin/exams/");

  return data.map((exam) => ({
    id: exam.id,
    title: exam.title,
    facultyName: exam.faculty_name,
    totalMarks: exam.total_marks,
    startTime: exam.start_time,
    endTime: exam.end_time,
  }));
};