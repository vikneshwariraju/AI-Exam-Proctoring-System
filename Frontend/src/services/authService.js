import api from "./api";

export const registerStudent = async (formData) => {
  const { data } = await api.post("/users/register/", {...formData, role: "student",});
  return data;
};

export const registerFaculty = async (formData) => {
  // formData: { name, email, password, confirm_password }
  const { data } = await api.post("/users/register/", {
    ...formData,
    role: "faculty",
  });
  return data;
};

export const loginUser = async ({ email, password, role }) => {
  const { data } = await api.post("/users/login/", { email, password });
  if (data.token) {
    localStorage.setItem("access_token", data.token);
    localStorage.setItem("refresh_token", data.refresh);
    localStorage.setItem("user", JSON.stringify({
      user_id: data.user_id,
      name: data.name,
      role :data.role,
    }));
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