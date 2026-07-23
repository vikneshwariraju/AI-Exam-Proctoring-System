export const mockLoginResponse = {
  token: "mock-token-123",
  refresh: "mock-refresh-123",
  role: "student",
  name: "Test Student",
  user_id: 1,
};

export const mockRegisterResponse = {
  id: 1,
  name: "Test Student",
  email: "test@example.com",
  role: "student",
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

export const mockFacultyStats = {
  totalExams: 4,
  totalQuestions: 38,
  upcomingExams: 2,
};

export const initialFacultyExams = [
  { id: 1, title: "Data Structures Mid-Term", subject: "CS201", duration: 60, totalMarks: 50, questionCount: 12, status: "published" },
  { id: 2, title: "DBMS Quiz 1", subject: "CS305", duration: 30, totalMarks: 20, questionCount: 8, status: "draft" },
  { id: 3, title: "Operating Systems Final", subject: "CS401", duration: 90, totalMarks: 100, questionCount: 15, status: "published" },
  { id: 4, title: "Networks Assignment Test", subject: "CS302", duration: 45, totalMarks: 30, questionCount: 3, status: "draft" },
];

export const mockStudentStats = {
  totalExams: 4,
  completedExams: 1,
  averageScore: 78,
};

export const initialStudentExams = [
  { id: 1, title: "Data Structures Mid-Term", subject: "CS201", duration: 60, totalMarks: 50, status: "available", startTime: "Available now" },
  { id: 2, title: "DBMS Quiz 1", subject: "CS305", duration: 30, totalMarks: 20, status: "upcoming", startTime: "Starts 15 Jul, 10:00 AM" },
  { id: 3, title: "Operating Systems Final", subject: "CS401", duration: 90, totalMarks: 100, status: "upcoming", startTime: "Starts 20 Jul, 2:00 PM" },
  { id: 4, title: "Web Technologies Quiz", subject: "CS303", duration: 30, totalMarks: 25, status: "completed", startTime: null, score: 20 },
];


export const mockResultsStats = {
  totalStudents: 45,
  totalExams: 6,
  passedCount: 34,
  failedCount: 11,
};

export const mockResultsList = [
  { id: 1, student: "Fresh Test", exam: "Data Structures Mid-Term", date: "10/07/2026", result: "passed", score: "9/10", timeSpent: "15 min" },
  { id: 2, student: "New Student", exam: "DBMS Quiz 1", date: "11/07/2026", result: "failed", score: "3/10", timeSpent: "16 min" },
  { id: 3, student: "Arjun Mehta", exam: "Operating Systems Final", date: "11/07/2026", result: "passed", score: "8/10", timeSpent: "20 min" },
  { id: 4, student: "Priya Sharma", exam: "Web Technologies Quiz", date: "12/07/2026", result: "passed", score: "9/10", timeSpent: "18 min" },
  { id: 5, student: "Rahul Nair", exam: "Data Structures Mid-Term", date: "12/07/2026", result: "failed", score: "4/10", timeSpent: "22 min" },
  { id: 6, student: "Divya Raj", exam: "DBMS Quiz 1", date: "13/07/2026", result: "passed", score: "8/10", timeSpent: "14 min" },
];


export const mockNotifications = [
  { id: 1, type: "warning", message: "DBMS Quiz 1 starts tomorrow at 10:00 AM", time: "2 hours ago" },
  { id: 2, type: "success", message: "Your Web Technologies Quiz result is out", time: "1 day ago" },
  { id: 3, type: "info", message: "New exam added: Operating Systems Final", time: "2 days ago" },
];


export const mockExamDetails = {
  1: {
    id: 1,
    title: "Data Structures Mid-Term",
    subject: "CS201",
    duration: 60,
    totalMarks: 50,
    deadline: "20 Jul 2026, 11:59 PM",
    description: "This exam covers arrays, linked lists, stacks, queues, and trees. Answer all questions within the time limit.",
    instructions: [
      "Please keep your camera on for the entire duration.",
      "Do not switch tabs or minimize the browser window.",
      "Ensure you are alone in a well-lit room.",
      "Once started, the timer cannot be paused.",
    ],
  },
};

export const mockExamQuestions = {
  1: [
    { id: 1, text: "Which data structure uses LIFO order?", options: ["Queue", "Stack", "Array", "Tree"], correctIndex: 1, difficulty: "easy" },
    { id: 2, text: "What is the time complexity of binary search?", options: ["O(n)", "O(n^2)", "O(log n)", "O(1)"], correctIndex: 2, difficulty: "medium" },
    { id: 3, text: "Which of these is not a linear data structure?", options: ["Array", "Linked List", "Tree", "Stack"], correctIndex: 2, difficulty: "medium" },
    { id: 4, text: "In a singly linked list, each node points to?", options: ["Previous node", "Next node", "Root node", "Itself"], correctIndex: 1, difficulty: "easy" },
    { id: 5, text: "Which traversal visits the root first?", options: ["Inorder", "Postorder", "Preorder", "Level order"], correctIndex: 2, difficulty: "hard" },
  ],
};

export const mockStudentResults = [
  { id: 1, exam: "Web Technologies Quiz", date: "10/07/2026", result: "passed", score: 20, totalMarks: 25, timeSpent: "18 min" },
];

export const mockPerformance = {
  overallAverage: 78,
  topicBreakdown: [
    { topic: "Arrays", accuracy: 85 },
    { topic: "Linked Lists", accuracy: 70 },
    { topic: "Trees", accuracy: 60 },
    { topic: "Sorting", accuracy: 90 },
  ],
  difficultyBreakdown: [
    { level: "Easy", accuracy: 92 },
    { level: "Medium", accuracy: 74 },
    { level: "Hard", accuracy: 55 },
  ],
};