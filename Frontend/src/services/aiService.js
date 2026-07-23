import api from "./authService";

export const logWarning = async (examId, warningType) => {
  const { data } = await api.post("/ai/log/", {
    exam: examId,
    warning_type: warningType,
  });

  return data;
};

export const getWarnings = async (examId) => {
  const { data } = await api.get(`/ai/warnings/${examId}/`);
  return data;
};