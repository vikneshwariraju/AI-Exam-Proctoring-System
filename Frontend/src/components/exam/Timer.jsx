import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const Timer = ({ initialSeconds, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds || 0);

  // Update timer when backend sends remaining seconds
  useEffect(() => {
    if (initialSeconds != null) {
      setSecondsLeft(initialSeconds);
    }
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft, onTimeUp]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const isLow = secondsLeft < 60;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: "var(--radius-md)",
        fontWeight: 700,
        fontSize: 15,
        background: isLow
          ? "var(--color-danger-bg)"
          : "var(--color-primary-light)",
        color: isLow
          ? "var(--color-danger)"
          : "var(--color-primary)",
      }}
    >
      <Clock size={16} />
      {String(mins).padStart(2, "0")}:
      {String(secs).padStart(2, "0")}
    </div>
  );
};

export default Timer;