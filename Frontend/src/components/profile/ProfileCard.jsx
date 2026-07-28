// src/components/profile/ProfileCard.jsx
const ProfileCard = ({ user, onEdit }) => (
  <div className="card" style={{ padding: 28, maxWidth: 480 }}>
    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
      {(user?.name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
    </div>
    <h2 style={{ fontSize: 18, margin: "0 0 2px" }}>{user?.name}</h2>
    <span className="badge badge-info" style={{ textTransform: "capitalize" }}>{user?.role}</span>

    <div style={{ marginTop: 20, fontSize: 13.5, color: "var(--color-text-secondary)" }}>
      <p><b>User ID:</b> {user?.user_id}</p>
    </div>
  </div>
);

export default ProfileCard;