import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Plus, Search, Pencil, Trash2} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {getFacultyExams, deleteExam} from "../../services/facultyService";

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

  return (
    <DashboardLayout activeItem="Manage Exams">

      <div className="row align-items-center mb-4">

  <div className="col-md-6">
    <h2 className="fw-bold  mb-1">
      Manage Exams
    </h2>

    <p className="text-muted mb-0">
      Create, edit and manage your exams.
    </p>
  </div>

  <div className="col-md-6 text-md-end mt-3 mt-md-0">

    <button
      className="btn btn-primary px-4 py-2 shadow-sm"
      onClick={() => navigate("/faculty/exams/create")}
    >
      <Plus size={18} className="me-2" />
      Create Exam
    </button>

  </div>

</div>

      {loadError && (
        <div className="card" style={{ padding: "12px 16px", marginBottom: 16, background: "#FEF2F2", color: "#B91C1C", fontSize: 13 }}>
          {loadError}
        </div>
      )}

      <div className="card" style={{ padding:20 }}>

        <div style={{ width:250, marginBottom:20 }}>
          <div style={{ position:"relative" }}>
            <Search
              size={15}
              style={{
                position:"absolute",
                left:12,
                top:11,
                color:"#94A3B8"
              }}
            />
            <input
              type="text"
              placeholder="Search Exam..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              style={{
                width:"100%",
                height:38,
                paddingLeft:35,
                borderRadius:10
              }}
            />
          </div>
        </div>

        <table
          style={{
            width:"100%",
            borderCollapse:"collapse"
          }}
        >
          <thead>
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Duration</th>
              <th>Total Marks</th>
              <th>Questions</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} style={{ padding: 20, textAlign: "center" }}>Loading exams...</td>
              </tr>
            )}

            {!loading && !loadError && filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 20, textAlign: "center" }}>
                  {exams.length === 0 ? "No exams created yet." : "No exams match your search."}
                </td>
              </tr>
            )}

            {!loading && filtered.map((exam)=>(
              <tr key={exam.id}>
                <td>{exam.title}</td>
                <td>{exam.subject}</td>
                <td>{exam.duration} min</td>
                <td>{exam.totalMarks}</td>
                <td>{exam.questionCount}</td>
                <td>{exam.status}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn-secondary-brand"
                    onClick={() => navigate(`/faculty/exams/${exam.id}/questions`)}
                  >
                    <Eye size={14} />
                    View
                  </button>

                  <button
                    className="btn-primary-brand"
                    onClick={() => navigate(`/faculty/exams/edit/${exam.id}`)}
                  ><Pencil size={14}/></button>

                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(exam.id)}
                  ><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}