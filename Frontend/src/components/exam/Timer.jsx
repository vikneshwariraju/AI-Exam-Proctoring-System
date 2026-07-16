import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const Timer = ({ durationMinutes, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp?.();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, onTimeUp]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const isLow = secondsLeft < 60;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
      borderRadius: "var(--radius-md)", fontWeight: 700, fontSize: 15,
      background: isLow ? "var(--color-danger-bg)" : "var(--color-primary-light)",
      color: isLow ? "var(--color-danger)" : "var(--color-primary)",
    }}>
      <Clock size={16} />
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
};

export default Timer;