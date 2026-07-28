import api from "./authService";

export const logWarning = async (examId, warningType) => {
  const { data } = await api.post("/ai-proctoring/log/", {
    exam: examId,
    warning_type: warningType,
  });

  return data;
};

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