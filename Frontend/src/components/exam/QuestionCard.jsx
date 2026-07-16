const QuestionCard = ({ question, index, total, selectedIndex, onSelect }) => (
  <div className="card" style={{ padding: 28 }}>
    <div style={{ fontSize: 12.5, color: "var(--color-text-secondary)", marginBottom: 8 }}>
      Question {index + 1} of {total}
    </div>
    <h3 style={{ fontSize: 16.5, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 22 }}>
      {question.text}
    </h3>

    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {question.options.map((opt, i) => (
        <label
          key={i}
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
            border: `1.5px solid ${selectedIndex === i ? "var(--color-primary)" : "var(--color-border)"}`,
            borderRadius: "var(--radius-md)", cursor: "pointer",
            background: selectedIndex === i ? "var(--color-primary-light)" : "#fff",
          }}
        >
          <input
            type="radio"
            name={`q-${question.id}`}
            checked={selectedIndex === i}
            onChange={() => onSelect(i)}
          />
          <span style={{ fontSize: 14, color: "var(--color-text-primary)" }}>{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

export default QuestionCard;