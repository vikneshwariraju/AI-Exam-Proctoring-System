import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * exams: array of { id, title, startTime } where startTime is any
 * parseable date string (ISO, "2026-08-03T10:00:00Z", etc).
 * Renders a month grid. Days with 1+ exam get a dot under the number.
 * Today gets a circled outline. Clicking a day with exams shows
 * their titles below the grid.
 */
const ExamCalendar = ({ exams = [] }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate() === viewDate.getDate() ? today : null);

  const examsByDay = useMemo(() => {
    const map = {};
    exams.forEach((exam) => {
      if (!exam.startTime) return;
      const d = new Date(exam.startTime);
      if (isNaN(d)) return;
      if (d.getFullYear() === viewDate.getFullYear() && d.getMonth() === viewDate.getMonth()) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(exam);
      }
    });
    return map;
  }, [exams, viewDate]);

  const firstDayOfWeek = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const cells = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isToday = (day) =>
    day === today.getDate() &&
    viewDate.getMonth() === today.getMonth() &&
    viewDate.getFullYear() === today.getFullYear();

  const changeMonth = (delta) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));
    setSelectedDay(null);
  };

  const monthLabel = viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const selectedExams = selectedDay ? (examsByDay[selectedDay] || []) : [];

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CalendarDays size={16} color="var(--color-primary)" />
          <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: "var(--color-text-primary)" }}>
            {monthLabel}
          </h3>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => changeMonth(-1)}
            style={{ border: "none", background: "none", cursor: "pointer", padding: 4, color: "var(--color-text-secondary)" }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => changeMonth(1)}
            style={{ border: "none", background: "none", cursor: "pointer", padding: 4, color: "var(--color-text-secondary)" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {DAY_LABELS.map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600 }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;

          const hasExam = !!examsByDay[day];
          const todayCell = isToday(day);
          const selected = selectedDay === day;

          return (
            <button
              key={i}
              onClick={() => setSelectedDay(selected ? null : day)}
              style={{
                position: "relative",
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12.5,
                borderRadius: 8,
                border: todayCell ? "1.5px solid var(--color-primary)" : "1px solid transparent",
                background: selected ? "var(--color-primary-light, #EFF6FF)" : "transparent",
                color: "var(--color-text-primary)",
                cursor: "pointer",
              }}
              title={hasExam ? examsByDay[day].map((e) => e.title).join(", ") : undefined}
            >
              {day}
              {hasExam && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 3,
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--color-primary)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div style={{ marginTop: 14, borderTop: "1px solid var(--color-border)", paddingTop: 12 }}>
          {selectedExams.length === 0 ? (
            <p style={{ fontSize: 12.5, color: "var(--color-text-muted)", margin: 0 }}>
              No exams on this day.
            </p>
          ) : (
            selectedExams.map((e) => (
              <div key={e.id} style={{ fontSize: 12.5, color: "var(--color-text-primary)", padding: "4px 0" }}>
                • {e.title}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExamCalendar;