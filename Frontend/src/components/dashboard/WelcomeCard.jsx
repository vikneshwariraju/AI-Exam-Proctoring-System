const WelcomeCard = ({ name }) => (
  <div
    className="rounded-4 text-white mb-4"
    style={{
      padding: "26px 28px",
      background: "linear-gradient(135deg, #2563EB, #4F46E5, #7C3AED)",
      boxShadow: "0 15px 35px rgba(37, 99, 235, 0.25)"
    }}
  >
    <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 600, margin: "0 0 4px" }}>
      Welcome back, {name || "Student"} 
    </h1>
    <p style={{ margin: 0, fontSize: 13.5, opacity: 0.9 }}>
      Here's what's happening with your exams today.
    </p>
  </div>
);

export default WelcomeCard;