import api from "./authService";

/**Exam details */
export const getExamDetails = async (examId) => {

    const { data } = await api.get("/exams/list/");

    const exam = Array.isArray(data)
        ? data.find((e) => String(e.id) === String(examId))
        : null;

    if (!exam) {
        return null;
    }
    return {
        id: exam.id,
        title: exam.title ?? exam.name ?? "Untitled Exam",
        subject: exam.subject ?? "",
        description: exam.description ?? "",
        duration: exam.duration ?? exam.duration_minutes ?? 0,
        totalMarks: exam.totalMarks ?? exam.total_marks ?? 0,
        startTime: exam.start_time ?? exam.startTime ?? "",
        deadline: exam.deadline ?? exam.end_time ?? "",
        instructions: Array.isArray(exam.instructions) ? exam.instructions : []
    };
};

//Exam Questions — camera_verified=true is required by the backend or it
//400s with "Camera must be enabled before starting the exam".
export const getExamQuestions = async (examId) => {
  const { data } = await api.get(`/submissions/start/${examId}/`, {
    params: {
      camera_verified: true,
    },
  });

  return {
    // Forwarded so the Timer can resume from where the student left off
    // on refresh/reconnect, instead of always restarting at full duration.
    remainingSeconds: data?.remaining_seconds ?? null,
    duration: data.duration,
    totalMarks: data.total_marks,
    questions: (data.questions || []).map((q) => ({
      id: q.id,
      text: q.question_text,
      options: [q.option1, q.option2, q.option3, q.option4].filter(
        (opt) => opt !== null && opt !== undefined && opt !== ""
      ),
      difficulty: q.difficulty,
      marks: q.marks ?? q.mark ?? 1,
    })),
  };
};

//Restore any answers the student already picked (e.g. after refresh/reconnect)
export const getSavedAnswers = async (examId) => {
  try {
    const { data } = await api.get(`/submissions/saved-answers/${examId}/`);
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
};

/**submit exam*/
export const submitAnswer = async (
    examId,
    questionId,
    selectedOption
) => {
    const { data } = await api.post("/submissions/submit/", {
        exam: examId,
        question: questionId,
        selected_option: selectedOption,
    });

    return data;
};

/**Exam result */
export const getExamResult = async (examId) => {
    try {
        const { data } = await api.get(`/results/view/${examId}/`);
        return data;
    } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 404) {
            return null;
        }
        throw err;
    }
};

/**student performance */
export const getStudentPerformance = async (examId) => {
    const { data } = await api.get(`/analytics/student-performance/${examId}/`);
    const order = ["easy", "medium", "hard"];
    const breakdown = data?.difficulty_breakdown || {};

    const difficultyBreakdown = order
        .filter((diff) => breakdown[diff])
        .map((diff) => ({
            difficulty: diff,
            total: breakdown[diff].total ?? 0,
            correct: breakdown[diff].correct ?? 0,
            accuracy: breakdown[diff].accuracy ?? null,
        }));
    return {
        examId: data?.exam_id,
        examTitle: data?.exam_title,
        marks: data?.marks ?? null,
        percentage: data?.percentage ?? null,
        difficultyBreakdown,
        weakAreas: Array.isArray(data?.weak_areas) ? data.weak_areas : [],
    };
};

export const finalizeExam = async (examId) => {
    const { data } = await api.post(`/results/calculate/${examId}/`);
    return data;
};