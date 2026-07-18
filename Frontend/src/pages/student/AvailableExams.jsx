import { useState, useEffect } from "react";
import { getStudentExams } from "../../services/studentService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ExamCard from "../../components/exam/ExamCard";
import SearchBar from "../../components/common/SearchBar";
import Loader from "../../components/common/Loader";

const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentExams().then((data) => {
      setExams(data);
      setLoading(false);
    });
  }, []);

  const filtered = exams.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout activeItem="Available Exams">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, margin: 0 }}>Available Exams</h1>
        <div style={{ width: 260 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search exams..." />
        </div>
      </div>

      {loading ? <Loader /> : filtered.map((exam) => <ExamCard key={exam.id} exam={exam} />)}
      {!loading && filtered.length === 0 && (
        <p style={{ color: "var(--color-text-muted)", fontSize: 13.5 }}>No exams match your search.</p>
      )}
    </DashboardLayout>
  );
};

export default AvailableExams;