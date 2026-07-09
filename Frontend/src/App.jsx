import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import FacultyLogin from "./pages/FacultyLogin";

const StudentDashboard = () => <h2>Student Dashboard (coming soon)</h2>;
const FacultyDashboard = () => <h2>Faculty Dashboard (coming soon)</h2>;
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
            <ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/faculty/dashboard" element={
            <ProtectedRoute allowedRoles={["faculty"]}><FacultyDashboard /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;