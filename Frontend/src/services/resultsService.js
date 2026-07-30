import api from "./authService";

// Get all results of an exam (Faculty)
export const getExamResults = async (examId) => {
  const { data } = await api.get(`/results/faculty/exam-results/${examId}/`);
  return data;
};

// Publish one student's result
export const publishResult = async (resultId) => {
  const { data } = await api.post(`/results/publish/${resultId}/`);
  return data;
};

// Publish all students' results
export const publishAllResults = async (examId) => {
  const { data } = await api.post(`/results/publish-all/${examId}/`);
  return data;
};