import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllExams, getExamAnalytics } from "../../services/adminService";

const Reports = () => {
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState("");
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        const data = await getAllExams();
        setExams(data);
        if (data.length > 0) {
            setSelectedExamId(data[0].id);
        }
    };

    useEffect(() => {
        if (selectedExamId) {
            loadAnalytics(selectedExamId);
        }
    }, [selectedExamId]);

    const loadAnalytics = async (examId) => {
        setLoading(true);
        setError("");
        const data = await getExamAnalytics(examId);
        if (data) {
            setAnalytics(data);
        } else {
            setAnalytics(null);
            setError("No results yet for this exam, or analytics unavailable.");
        }
        setLoading(false);
    };

    return (
        <DashboardLayout activeItem="Reports">
            <h2>Reports</h2>

            <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                <label htmlFor="exam-select" style={{ marginRight: 10 }}>
                    Select Exam:
                </label>
                <select
                    id="exam-select"
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                >
                    {exams.map((exam) => (
                        <option key={exam.id} value={exam.id}>
                            {exam.title}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <p>Loading analytics...</p>}
            {error && <div className="card" style={{ padding: 20 }}>{error}</div>}

            {analytics && !loading && (
                <>
                    <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                        <h3>{analytics.exam_title}</h3>
                        <div style={{ display: "flex", gap: 30, flexWrap: "wrap", marginTop: 10 }}>
                            <div>
                                <strong>Total Students:</strong> {analytics.total_students}
                            </div>
                            <div>
                                <strong>Average Marks:</strong> {analytics.average_marks}
                            </div>
                            <div>
                                <strong>Average %:</strong> {analytics.average_percentage}%
                            </div>
                            <div>
                                <strong>Highest:</strong> {analytics.highest_marks}
                            </div>
                            <div>
                                <strong>Lowest:</strong> {analytics.lowest_marks}
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: 20 }}>
                        <h3>Difficulty-wise Class Accuracy</h3>
                        <table className="table" style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>Difficulty</th>
                                    <th>Total Answered</th>
                                    <th>Correct</th>
                                    <th>Accuracy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(analytics.class_difficulty_breakdown).map(
                                    ([diff, stats]) => (
                                        <tr key={diff}>
                                            <td style={{ textTransform: "capitalize" }}>{diff}</td>
                                            <td>{stats.total}</td>
                                            <td>{stats.correct}</td>
                                            <td>
                                                {stats.accuracy !== null ? `${stats.accuracy}%` : "—"}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default Reports;