const StudentTable = ({ students }) => {
  return (
    <div className="card" style={{ padding: 20 }}>
      {students.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", padding: "20px 0", textAlign: "center" }}>
          No students found.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["ID", "Name", "Email", "Joined"].map((h) => (
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
              {students.map((student) => (
                <tr key={student.id} className="row-hover" style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>{student.id}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13.5, fontWeight: 500, color: "var(--color-text-primary)" }}>{student.name}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>{student.email}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>
                    {student.created_at
                      ? new Date(student.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentTable;