import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ExamCard from "../../components/exam/ExamCard";
import { getStudentExams } from "../../services/studentService";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "available", label: "Available" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
];

const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    getStudentExams()
      .then(setExams)
      .catch(() => setExams([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return exams
      .filter((e) => filter === "all" ? true : e.status === filter)
      .filter((e) =>
        query.trim() === "" ||
        e.title?.toLowerCase().includes(query.toLowerCase()) ||
        e.subject?.toLowerCase().includes(query.toLowerCase())
      );
  }, [exams, filter, query]);

  const countFor = (key) =>
    key === "all" ? exams.length : exams.filter((e) => e.status === key).length;

  return (
    <DashboardLayout activeItem="Available Exams">
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
            Available Exams
          </h1>

          <div style={{ position: "relative", width: 260, maxWidth: "100%" }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: 11, color: "#94A3B8" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exams..."
              style={{
                width: "100%", height: 38, borderRadius: 10,
                border: "1px solid var(--color-border, #E5E7EB)",
                paddingLeft: 34, paddingRight: 12, fontSize: 13,
              }}
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={filter === f.key ? "btn-primary-brand" : "btn-secondary-brand"}
              style={{ fontSize: 13 }}
            >
              {f.label} <span style={{ opacity: 0.75, marginLeft: 4 }}>({countFor(f.key)})</span>
            </button>
          ))}
        </div>

        {/* Exam list */}
        {loading && (
          <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)" }}>Loading exams...</p>
        )}

        {!loading && filtered.length === 0 && (
          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: 0 }}>
              No exams match this filter.
            </p>
          </div>
        )}

        {!loading && filtered.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AvailableExams;