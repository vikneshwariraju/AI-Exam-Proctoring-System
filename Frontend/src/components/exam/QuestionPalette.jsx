const QuestionPalette = ({ questions, answers, currentIndex, onJump }) => {
  return (
    <div className="card" style={{ padding: 20 }}>
      <h4 style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 14, color: "var(--color-text-primary)" }}>
        Question Palette
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {questions.map((q, i) => {
          if (!q) return null; // guard against missing question data
          const isAnswered = answers[q.id] !== undefined;
          const isCurrent = i === currentIndex;

          return (
            <button
              key={q.id ?? i}
              onClick={() => onJump(i)}
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--radius-sm)",
                border: isCurrent ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                background: isAnswered ? "var(--color-primary-light)" : "#fff",
                color: "var(--color-text-primary)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: "var(--color-text-secondary)" }}>
        Answered: {Object.keys(answers).length} / {questions.length}
      </div>
    </div>
  );
};

export default QuestionPalette;