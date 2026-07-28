import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

//Auth pages
import StudentLogin from "./pages/auth/StudentLogin";
import StudentRegister from "./pages/auth/StudentRegister";
import FacultyLogin from "./pages/auth/FacultyLogin";

//student pages 
import StudentDashboardPage from "./pages/student/Dashboard";
import AvailableExams from "./pages/student/AvailableExams";
import ExamInstructions from "./pages/student/ExamInstructions";
import AttendExam from "./pages/student/AttendExam";
import StudentResults from "./pages/student/Results";
import ResultDetails from "./pages/student/ResultDetails";
import Performance from "./pages/student/Performance";
import StudentProfile from "./pages/student/Profile";
import ResultsPage from "./pages/faculty/ResultsPage";

//faculty pages
import FacultyDashboard from "./pages/faculty/Dashboard";
import CreateExam from "./pages/faculty/CreateExam";
import AddQuestions from "./pages/faculty/AddQuestions";

//admin page
import AdminDashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import Faculty from "./pages/admin/Faculty";
import Exams from "./pages/admin/Exams";
import AIAlerts from "./pages/admin/AIAlerts";
import Reports from "./pages/admin/Reports";


const Unauthorized = () => <h2>You are not authorized to view this page.</h2>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/student/login" replace />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/faculty/login" element={<FacultyLogin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={["student"]}><StudentDashboardPage /></ProtectedRoute>
          } />
          <Route path="/student/exams" element={
            <ProtectedRoute allowedRoles={["student"]}><AvailableExams /></ProtectedRoute>
          } />
          <Route path="/student/exams/:examId/instructions" element={
            <ProtectedRoute allowedRoles={["student"]}><ExamInstructions /></ProtectedRoute>} />
          <Route path="/student/exams/:examId/attend" element={
            <ProtectedRoute allowedRoles={["student"]}><AttendExam /></ProtectedRoute>} />
          <Route path="/student/results" element={
            <ProtectedRoute allowedRoles={["student"]}><StudentResults /></ProtectedRoute>} />
          <Route path="/student/results/:examId" element={
            <ProtectedRoute allowedRoles={["student"]}><ResultDetails /></ProtectedRoute>} />
          <Route path="/student/performance" element={
            <ProtectedRoute allowedRoles={["student"]}><Performance /></ProtectedRoute>} />
          <Route path="/student/profile" element={
            <ProtectedRoute allowedRoles={["student"]}><StudentProfile /></ProtectedRoute>} />

          <Route path="/faculty/dashboard" element={
            <ProtectedRoute allowedRoles={["faculty"]}><FacultyDashboard /></ProtectedRoute>} />
          <Route path="/faculty/exams/create" element={
            <ProtectedRoute allowedRoles={["faculty"]}><CreateExam /></ProtectedRoute>} />
          <Route path="/faculty/exams/:examId/questions" element={
            <ProtectedRoute allowedRoles={["faculty"]}><AddQuestions /></ProtectedRoute>} />
          <Route path="/faculty/results" element={
            <ProtectedRoute allowedRoles={["faculty"]}><ResultsPage /></ProtectedRoute> } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute> } />
          <Route path="/admin/students" element={
            <ProtectedRoute allowedRoles={["admin"]}> <Students /></ProtectedRoute>}/>
          <Route path="/admin/faculty" element={
            <ProtectedRoute allowedRoles={["admin"]}>  <Faculty /> </ProtectedRoute> } />
          <Route path="/admin/exams" element={
            <ProtectedRoute allowedRoles={["admin"]}> <Exams /> </ProtectedRoute> }/>
          <Route path="/admin/ai-alerts" element={ 
            <ProtectedRoute allowedRoles={["admin"]}> <AIAlerts /> </ProtectedRoute>  }/>
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={["admin"]}> <Reports /> </ProtectedRoute> } />
          <Route path="*" element={<Navigate to="/student/login" replace />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;