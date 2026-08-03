import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Plus, Search, Pencil, Trash2 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getFacultyExams, deleteExam } from "../../services/facultyService";

const STATUS_STYLES = {
  active: { bg: "#ECFDF5", color: "#047857" },
  upcoming: { bg: "#EFF6FF", color: "#1D4ED8" },
  completed: { bg: "#F3F4F6", color: "#4B5563" },
  closed: { bg: "#F3F4F6", color: "#4B5563" },
};

export default function ManageExams() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getFacultyExams(user.user_id);
      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load exams:", err.response?.data || err);
      setLoadError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Could not load exams. The server returned an error — please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const filtered = exams.filter((exam) =>
    exam.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this exam?");
    if (!ok) return;

    try {
      await deleteExam(id);
      setExams((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert("Unable to delete exam.");
    }
  };

  const statusStyle = (status) =>
    STATUS_STYLES[String(status).toLowerCase()] || { bg: "#F3F4F6", color: "#4B5563" };

  return (
    <DashboardLayout activeItem="Manage Exams">

      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
  <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 6, color: "var(--color-text-primary)" }}>
    Manage Exams
  </h1>
  <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", margin: 0 }}>
    Create, edit and manage your exams.
  </p>
</div>

        <div className="col-md-6 text-md-end mt-3 mt-md-0">
          <button
            className="btn-primary-brand d-flex align-items-center gap-2"
            style={{ display: "inline-flex", padding: "10px 18px", borderRadius: 10, fontSize: 13.5, fontWeight: 600, marginLeft: "auto" }}
            onClick={() => navigate("/faculty/exams/create")}
          >
            <Plus size={16} />
            Create Exam
          </button>
        </div>
      </div>

      {loadError && (
        <div className="card" style={{ padding: "12px 16px", marginBottom: 16, background: "#FEF2F2", color: "#B91C1C", fontSize: 13, borderRadius: 10 }}>
          {loadError}
        </div>
      )}

      <div className="card" style={{ padding: 24, borderRadius: 14 }}>

        {/* Search */}
        <div style={{ width: 280, marginBottom: 22 }}>
          <div style={{ position: "relative" }}>
            <Search
              size={15}
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}
            />
            <input
              type="text"
              placeholder="Search exam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                height: 40,
                paddingLeft: 38,
                paddingRight: 14,
                borderRadius: 10,
                border: "1px solid var(--color-border)",
                fontSize: 13.5,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 760 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["Title", "Subject", "Duration", "Total Marks", "Questions", "Status", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: h === "" ? "right" : "left",
                      padding: "0 16px 14px",
                      fontSize: 11.5,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      color: "var(--color-text-secondary)",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13.5 }}>
                    Loading exams...
                  </td>
                </tr>
              )}

              {!loading && !loadError && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13.5 }}>
                    {exams.length === 0 ? "No exams created yet." : "No exams match your search."}
                  </td>
                </tr>
              )}

              {!loading && filtered.map((exam) => {
                const st = statusStyle(exam.status);
                return (
                  <tr key={exam.id} className="row-hover" style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "16px", fontSize: 13.5, fontWeight: 600, color: "var(--color-text-primary)" }}>
                      {exam.title}
                    </td>
                    <td style={{ padding: "16px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>
                      {exam.subject}
                    </td>
                    <td style={{ padding: "16px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>
                      {exam.duration} min
                    </td>
                    <td style={{ padding: "16px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>
                      {exam.totalMarks}
                    </td>
                    <td style={{ padding: "16px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>
                      {exam.questionCount}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: "capitalize",
                          background: st.bg,
                          color: st.color,
                        }}
                      >
                        {exam.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          title="View questions"
                          onClick={() => navigate(`/faculty/exams/${exam.id}/questions`)}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 34, height: 34, borderRadius: 8,
                            border: "1px solid var(--color-border)", background: "#fff",
                            color: "var(--color-text-secondary)", cursor: "pointer",
                          }}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          title="Edit exam"
                          onClick={() => navigate(`/faculty/exams/edit/${exam.id}`)}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 34, height: 34, borderRadius: 8,
                            border: "1px solid #C7D2FE", background: "#EEF2FF",
                            color: "#4338CA", cursor: "pointer",
                          }}
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          title="Delete exam"
                          onClick={() => handleDelete(exam.id)}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 34, height: 34, borderRadius: 8,
                            border: "1px solid #FECACA", background: "#FEF2F2",
                            color: "#DC2626", cursor: "pointer",
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}