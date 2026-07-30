import { useEffect, useState } from "react";
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
        err.response?.data?.error ||
          "No warnings found for this exam."
      );
    } finally {
      setLoadingWarnings(false);
    }
  };

  if (loadingExams) {
    return (
      <DashboardLayout activeItem="AI Alerts">
        <Loader label="Loading Exams..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="AI Alerts">

      <div className="card p-4">

        <h3 className="mb-4">
          AI Proctoring Alerts
        </h3>

        <div
          style={{
            display: "flex",
            gap: 15,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 25,
          }}
        >
          <select
            className="form-select"
            style={{ maxWidth: 350 }}
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>

          <button
            className="btn btn-primary"
            onClick={loadWarnings}
          >
            View Alerts
          </button>
        </div>

        {loadingWarnings && (
          <Loader label="Loading Alerts..." />
        )}

        {error && (
          <div
            className="alert alert-warning"
            style={{ marginBottom: 20 }}
          >
            {error}
          </div>
        )}

        {!loadingWarnings &&
          warnings.length > 0 && (

            <div className="table-responsive">

              <table className="table table-bordered table-hover">

                <thead className="table-dark">
                  <tr>
                    <th>Student</th>
                    <th>Total Warnings</th>
                    <th>Status</th>
                    <th>Warning History</th>
                  </tr>
                </thead>

                <tbody>

                  {warnings.map((student) => (

                    <tr key={student.student_id}>

                      <td>
                        {student.student_name}
                      </td>

                      <td>
                        {student.warning_count}
                      </td>

                      <td>
                        {student.flagged ? (
                          <span className="badge bg-danger">
                            Flagged
                          </span>
                        ) : (
                          <span className="badge bg-success">
                            Safe
                          </span>
                        )}
                      </td>

                      <td>

                        <table className="table table-sm">

                          <thead>

                            <tr>
                              <th>Type</th>
                              <th>Time</th>
                            </tr>

                          </thead>

                          <tbody>

                            {student.warnings.map((warning, index) => (

                              <tr key={index}>

                                <td>{warning.type}</td>

                                <td>
                                  {new Date(
                                    warning.timestamp
                                  ).toLocaleString()}
                                </td>

                              </tr>

                            ))}

                          </tbody>

                        </table>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        {!loadingWarnings &&
          warnings.length === 0 &&
          !error && (
            <div
              className="text-center text-muted"
              style={{ padding: 40 }}
            >
              Select an exam and click
              <b> View Alerts</b>.
            </div>
          )}

      </div>

    </DashboardLayout>
  );
};

export default AIAlerts;