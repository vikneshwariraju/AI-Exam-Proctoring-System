const Loader = ({ label = "Loading..." }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0", color: "var(--color-text-secondary)", fontSize: 14 }}>
    <div
      style={{
        width: 18, height: 18, marginRight: 10,
        border: "2.5px solid var(--color-border)",
        borderTopColor: "var(--color-primary)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
    {label}
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Loader;