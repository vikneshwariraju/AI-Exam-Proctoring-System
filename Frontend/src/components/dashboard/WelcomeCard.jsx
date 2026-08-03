const WelcomeCard = ({ name }) => (
  <div
    className="mb-4"
    style={{
      padding: "24px 28px",
      borderRadius: 12,
      background: "var(--color-primary-light)",
      border: "1px solid #DBEAFE",
    }}
  >
    <h1
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 21,
        fontWeight: 600,
        margin: "0 0 4px",
        color: "var(--color-text-primary)",
      }}
    >
      Welcome back, {name || "Student"}
    </h1>
    <p style={{ margin: 0, fontSize: 13.5, color: "var(--color-text-secondary)" }}>
      Here's what's happening with your exams today.
    </p>
  </div>
);

export default WelcomeCard;