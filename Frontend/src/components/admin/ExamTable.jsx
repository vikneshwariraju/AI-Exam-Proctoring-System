const ExamTable = ({ exams }) => {
  return (
    <div className="card" style={{ padding: 20 }}>
      {exams.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", padding: "20px 0", textAlign: "center" }}>
          No exams found.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["Title", "Faculty", "Total Marks", "Start", "End"].map((h) => (
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
              {exams.map((exam) => (
                <tr key={exam.id} className="row-hover" style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "12px 14px", fontSize: 13.5, fontWeight: 500, color: "var(--color-text-primary)" }}>{exam.title}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>{exam.facultyName}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>{exam.totalMarks}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>
                    {exam.startTime
                      ? new Date(exam.startTime).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--color-text-secondary)" }}>
                    {exam.endTime
                      ? new Date(exam.endTime).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
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

export default ExamTable;