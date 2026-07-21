import api from "./api";
import { mockLoginResponse, mockRegisterResponse } from "./mockData";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const registerStudent = async (formData) => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockRegisterResponse), 500)
    );
  }
  const { data } = await api.post("/users/register/", { ...formData, role: "student" });
  return data;
};

export const registerFaculty = async (formData) => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ...mockRegisterResponse, role: "faculty" }), 500)
    );
  }
  const { data } = await api.post("/users/register/", { ...formData, role: "faculty" });
  return data;
};

export const loginUser = async ({ email, password }, roleOverride) => {
  let data;

  if (USE_MOCK) {
    data = { ...mockLoginResponse, role: roleOverride || mockLoginResponse.role };
    await new Promise((resolve) => setTimeout(resolve, 500));
  } else {
    const response = await api.post("/users/login/", { email, password });
    data = response.data;
  }

  if (data.token) {
    localStorage.setItem("access_token", data.token);
    localStorage.setItem("refresh_token", data.refresh);
    localStorage.setItem(
      "user",
      JSON.stringify({ user_id: data.user_id, name: data.name, role: data.role })
    );
  }

  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};