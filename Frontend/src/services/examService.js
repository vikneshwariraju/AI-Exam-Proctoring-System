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
        description: exam.description ?? "",
        duration: exam.duration ?? exam.duration_minutes ?? 0,
        totalMarks: exam.totalMarks ?? exam.total_marks ?? 0,
        deadline: exam.deadline ?? exam.end_time ?? "",
        instructions: Array.isArray(exam.instructions) ? exam.instructions : []
    };
};

//Exam Questions
export const getExamQuestions = async (examId) => {
  const { data } = await api.get(`/submissions/start/${examId}/`,
  {
      params: {
        camera_verified: true,
      },
    }
  );
  return {
    questions: data.questions.map((q) => ({
      id: q.id,
      text: q.question_text,
      options: [
        q.option1,
        q.option2,
        q.option3,
        q.option4,
      ],
      difficulty: q.difficulty,
    })),
    duration: data.duration,
    totalMarks: data.total_marks,
  };
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
