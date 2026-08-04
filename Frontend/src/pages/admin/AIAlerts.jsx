import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getFlaggedAlerts } from "../../services/adminService";

const AIAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await getFlaggedAlerts();
        setAlerts(data);
        setLoading(false);
    };

    return (
        <DashboardLayout activeItem="AI Alerts">
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 6, color: "var(--color-text-primary)" }}>
                AI Alerts
            </h1>
            <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", marginBottom: 24 }}>
                Students flagged by the AI proctoring system for repeated suspicious activity.
            </p>

            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div
                        className="card"
                        style={{
                            padding: 18,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Flagged Students</div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 4 }}>
                                {loading ? "—" : alerts.length}
                            </div>
                        </div>
                        <AlertTriangle size={22} color="var(--color-danger)" />
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16, color: "var(--color-text-primary)" }}>
                    Flagged Students
                </h3>

                {loading ? (
                    <Loader label="Loading alerts..." />
                ) : alerts.length === 0 ? (
                    <p style={{ fontSize: 13, color: "var(--color-text-muted)", padding: "20px 0", textAlign: "center" }}>
                        No students currently flagged.
                    </p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                                    {["Student", "Exam", "Warnings", "Warning Types"].map((h) => (
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
                                {alerts.map((a) => (
                                    <tr
                                        key={`${a.student_id}-${a.exam_id}`}
                                        className="row-hover"
                                        style={{ borderBottom: "1px solid var(--color-border)" }}
                                    >
                                        <td style={{ padding: "12px 14px", fontSize: 13.5, fontWeight: 500, color: "var(--color-text-primary)" }}>
                                            {a.student_name}
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>
                                            {a.exam_title}
                                        </td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <span className="badge-danger">{a.warning_count}</span>
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--color-text-secondary)" }}>
                                            {[...new Set(a.warnings.map((w) => w.type))].join(", ")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AIAlerts;