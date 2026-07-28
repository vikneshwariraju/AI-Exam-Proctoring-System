import api from "./authService";

/**
 * POST /api/ai-proctoring/log/
 * Logs a proctoring warning (face missing / multiple faces / tab switch).
 */
export const logWarning = async (examId, warningType) => {
  const { data } = await api.post("/ai-proctoring/log/", {
    exam: examId,
    warning_type: warningType,
  });

  return data;
};

/**
 * GET /api/ai-proctoring/warnings/<exam_id>/
 * Faculty view of all warnings logged for an exam.
 */
export const getWarnings = async (examId) => {
  const { data } = await api.get(`/ai-proctoring/warnings/${examId}/`);
  return data;
};

export const detectFace = async (examId, image) => {
  const { data } = await api.post("/ai-proctoring/detect-face/", {
    exam: examId,
    image,
  });

  return data;
};