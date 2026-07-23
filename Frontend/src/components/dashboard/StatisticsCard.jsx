const StatisticsCard = ({ label, value, icon, bg }) => (
  <div className="card hover-lift" style={{ padding: 20 }}>
    <div
      className="icon-circle"
      style={{ background: bg, marginBottom: 14 }}
    >
      {icon}
    </div>
    <div style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700, color: "var(--color-text-primary)" }}>
      {value}
    </div>
    <div style={{ fontSize: 12.5, color: "var(--color-text-secondary)", marginTop: 2 }}>
      {label}
    </div>
  </div>
);

export default StatisticsCard;