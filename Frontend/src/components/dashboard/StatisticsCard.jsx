import { cloneElement } from "react";

const StatisticsCard = ({ label, value, icon }) => (
  <div
    className="hover-lift"
    style={{
      padding: 20,
      borderRadius: 16,
      background: "linear-gradient(135deg, #2563EB, #4F46E5)",
      boxShadow: "0 10px 30px rgba(37, 99, 235, 0.25)"
    }}
  >
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        background: "rgba(255,255,255,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
      }}
    >
      {/* Force the icon white regardless of the color prop each dashboard
          passes in — cloneElement overrides it so every stat card looks
          consistent on the blue background. */}
      {cloneElement(icon, { color: "#ffffff" })}
    </div>
    <div style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700, color: "#ffffff" }}>
      {value}
    </div>
    <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
      {label}
    </div>
  </div>
);

export default StatisticsCard;