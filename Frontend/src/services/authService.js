import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach the JWT access token to every outgoing request, EXCEPT public
const PUBLIC_ENDPOINTS = ["/users/login/", "/users/register/","/users/forgot-password/",
  "/users/reset-password/",];
api.interceptors.request.use((config) => {

    const isPublic = PUBLIC_ENDPOINTS.some((path) => config.url?.includes(path));
    const token = localStorage.getItem("access_token");

    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//Register student
export const registerStudent = async (formData) => {
    const response = await api.post("/users/register/", formData);
    return response.data;
};

//login 
export const loginUser = async ({ email, password }) => {
    const response = await api.post("/users/login/", { email, password });
    const data = response.data;

    const token = data.token ?? data.access ?? data.access_token;
    const refresh = data.refresh ?? data.refresh_token;
    const { role, name, user_id } = data;

    if (!token) {
        console.error("Login response did not include an access token. Response was:", data);
        throw new Error("Login succeeded but no access token was returned by the server.");
    }
    localStorage.setItem("access_token", token);
    if (refresh) localStorage.setItem("refresh_token", refresh);

    return { token, refresh, role, name, user_id };
};

//logout
export const logoutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

// Forgot Password
export const forgotPassword = async (email) => {
  const response = await api.post("/users/forgot-password/", {
    email,
  });

  return response.data;
};

// Reset Password
export const resetPassword = async ({
  email,
  otp,
  new_password,
  confirm_password,
}) => {
  const response = await api.post("/users/reset-password/", {
    email,
    otp,
    new_password,
    confirm_password,
  });

  return response.data;
};

// Change Password
export const changePassword = async ({
  old_password,
  new_password,
  confirm_password,
}) => {
  const response = await api.post("/users/change-password/", {
    old_password,
    new_password,
    confirm_password,
  });

  return response.data;
};

export default api;