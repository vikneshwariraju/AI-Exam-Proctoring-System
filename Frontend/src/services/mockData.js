export const mockLoginResponse = {
  token: "mock-token-123",
  refresh: "mock-refresh-123",
  role: "admin",
  name: "Test Student",
  user_id: 1,
};

export const mockRegisterResponse = {
  id: 1,
  name: "Test Student",
  email: "test@example.com",
  role: "admin",
};

export const mockStats = {
  totalStudents: 128,
  totalFaculty: 14,
  activeExams: 3,
  flaggedAlerts: 7,
};

export const initialStudents = [
  { id: 1, name: "Fresh Test", email: "freshtest@example.com", status: "active" },
  { id: 2, name: "New Student", email: "newstudent@example.com", status: "active" },
  { id: 3, name: "Arjun Mehta", email: "arjun@example.com", status: "active" },
];

export const initialFaculty = [
  { id: 101, name: "Prof. Kumar", email: "kumar@example.com", status: "active" },
  { id: 102, name: "Dr. Lakshmi", email: "lakshmi@example.com", status: "active" },
];