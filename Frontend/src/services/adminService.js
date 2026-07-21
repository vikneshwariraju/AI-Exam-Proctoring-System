import api from "./api";
import { initialStudents, initialFaculty, mockStats } from "./mockData";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// In-memory store so mock "Add Faculty" persists during the session
let facultyStore = [...initialFaculty];
let nextId = 200;

export const getDashboardStats = async () => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return mockStats;
  }
  const { data } = await api.get("/admin/stats/");
  return data;
};

export const getAllStudents = async () => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return initialStudents;
  }
  const { data } = await api.get("/admin/students/");
  return data;
};

export const getAllFaculty = async () => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return facultyStore;
  }
  const { data } = await api.get("/admin/faculty/");
  return data;
};

export const createFaculty = async (facultyData) => {
  // facultyData: { name, email, password }
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    const newFaculty = { id: nextId++, name: facultyData.name, email: facultyData.email, status: "active" };
    facultyStore = [...facultyStore, newFaculty];
    return newFaculty;
  }
  const { data } = await api.post("/admin/faculty/create/", { ...facultyData, role: "faculty" });
  return data;
};