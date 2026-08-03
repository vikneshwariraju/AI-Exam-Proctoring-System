import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getFacultyExams } from "../../services/facultyService";
import { getWarnings } from "../../services/aiService";

const AIAlerts = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingWarnings, setLoadingWarnings] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const data = await getFacultyExams();
      setExams(data);
      if (data.length > 0) {
        setSelectedExam(data[0].id);
      }
    } catch (err) {
      setError("Failed to load exams.");
    } finally {
      setLoadingExams(false);
    }
  };

  const loadWarnings = async () => {
    if (!selectedExam) return;

    setLoadingWarnings(true);
    setError("");

    try {
      const data = await getWarnings(selectedExam);
      setWarnings(data);
    } catch (err) {
      console.log(err);
      setWarnings([]);
      setError(
        err.response?.data?.error || "No warnings found for this exam."
      );
    } finally {
      setLoadingWarnings(false);
    }
  };

  if (loadingExams) {
    return (
      <DashboardLayout activeItem="AI Alerts">
        <Loader label="Loading exams..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="AI Alerts">
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 6, color: "var(--color-text-primary)" }}>
        AI Proctoring Alerts
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", marginBottom: 24 }}>
        Review AI-detected warnings for students during your exams.
      </p>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 22 }}>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            style={{
              height: 40,
              minWidth: 260,
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              padding: "0 12px",
              fontSize: 13.5,
              color: "var(--color-text-primary)",
            }}
          >
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>

          <button className="btn-primary-brand" onClick={loadWarnings}>
            View Alerts
          </button>
        </div>

        {loadingWarnings && <Loader label="Loading alerts..." />}

        {error && (
          <div style={{ background: "#FFFBEB", color: "#92400E", padding: "12px 16px", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {!loadingWarnings && warnings.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  {["Student", "Total Warnings", "Status", "Warning History"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "10px 14px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--color-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {warnings.map((student) => (
                  <tr key={student.student_id} className="row-hover" style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "12px 14px", fontSize: 13.5, fontWeight: 500, color: "var(--color-text-primary)" }}>
                      {student.student_name}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span className={student.flagged ? "badge-danger" : "badge-success"}>
                        {student.warning_count}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span className={student.flagged ? "badge-danger" : "badge-success"}>
                        {student.flagged ? "Flagged" : "Safe"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {student.warnings.map((warning, index) => (
                          <div key={index} style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>
                            <span style={{ fontWeight: 500, color: "var(--color-text-primary)", textTransform: "capitalize" }}>
                              {warning.type.replace(/_/g, " ")}
                            </span>
                            {" — "}
                            {new Date(warning.timestamp).toLocaleString()}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loadingWarnings && warnings.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--color-text-muted)", fontSize: 13.5 }}>
            <AlertTriangle size={28} color="var(--color-text-muted)" style={{ marginBottom: 10 }} />
            <div>Select an exam and click <b>View Alerts</b>.</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AIAlerts;