import axios from "axios";

// Set VITE_API_BASE_URL in a .env file at your project root if Django
// runs somewhere other than the local default below.
// e.g.  VITE_API_BASE_URL=http://127.0.0.1:8000/api
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach the JWT access token to every outgoing request, EXCEPT public
// endpoints like login/register — sending a stale/expired token there
// causes DRF's JWTAuthentication to reject the request with "token expired"
// before the view even checks the submitted credentials.
const PUBLIC_ENDPOINTS = ["/users/login/", "/users/register/"];

api.interceptors.request.use((config) => {

    const isPublic = PUBLIC_ENDPOINTS.some((path) => config.url?.includes(path));

    const token = localStorage.getItem("access_token");

    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

/**
 * POST /users/register/
 * Backend always sets role='student' server-side, so this only
 * ever creates a student account. The serializer requires
 * confirm_password too, so we send the form data as-is.
 * No tokens are returned on register — log in afterwards.
 */
export const registerStudent = async (formData) => {

    const response = await api.post("/users/register/", formData);

    return response.data;

};

/**
 * POST /login/
 * Shared endpoint for student, faculty and admin. The backend decides
 * the role from the user record and returns it — the caller should check
 * data.role and act accordingly (this file doesn't enforce which role
 * is "allowed" to log in here, the calling component does).
 */
export const loginUser = async ({ email, password }) => {

    const response = await api.post("/users/login/", { email, password });

    const { token, refresh, role, name, user_id } = response.data;

    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", refresh);

    return { token, refresh, role, name, user_id };

};

export const logoutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

export default api;