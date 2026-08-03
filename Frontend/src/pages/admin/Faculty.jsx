import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getAllFaculty } from "../../services/adminService";

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllFaculty()
      .then(setFaculty)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout activeItem="Faculty">
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 21, marginBottom: 6, color: "var(--color-text-primary)" }}>
        Faculty
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", marginBottom: 24 }}>
        All faculty accounts registered on the platform.
      </p>

      <div className="card" style={{ padding: 20 }}>
        {loading ? (
          <Loader label="Loading faculty..." />
        ) : faculty.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", padding: "20px 0", textAlign: "center" }}>
            No faculty accounts found.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  {["Name", "Email", "Joined"].map((h) => (
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
                {faculty.map((f) => (
                  <tr key={f.id} className="row-hover" style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "12px 14px", fontSize: 13.5, fontWeight: 500, color: "var(--color-text-primary)" }}>
                      {f.name}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>
                      {f.email}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>
                      {f.created_at ? new Date(f.created_at).toLocaleDateString() : "—"}
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

export default Faculty;