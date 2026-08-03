const StatisticsCard = ({ label, value, icon }) => (
  <div
    className="card hover-lift"
    style={{
      padding: 18,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <div>
      <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "var(--color-text-primary)",
          marginTop: 4,
        }}
      >
        {value}
      </div>
    </div>
    {icon}
  </div>
);

export default StatisticsCard;