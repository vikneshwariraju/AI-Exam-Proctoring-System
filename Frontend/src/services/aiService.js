import api from "./authService";

//record the warnings
export const logWarning = async (examId, warningType) => {
  const { data } = await api.post("/ai-proctoring/log/", {
    exam: examId,
    warning_type: warningType,
  });
  return data;
};

//fetch warnings
export const getWarnings = async (examId) => {
  const { data } = await api.get(`/ai-proctoring/warnings/${examId}/`);
  return data;
};

//send the image to the backend AI 
export const detectFace = async (examId, image) => {
  const { data } = await api.post("/ai-proctoring/detect-face/", {
    exam: examId,
    image,
  });
  return data;
};