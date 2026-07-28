import { Bell, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const ICON_STYLES = {
  info: { icon: <Info size={14} color="#0891B2" />, bg: "#ECFEFF" },
  success: { icon: <CheckCircle2 size={14} color="var(--color-success)" />, bg: "#ECFDF5" },
  warning: { icon: <AlertTriangle size={14} color="var(--color-warning)" />, bg: "#FFFBEB" },
};

const NotificationCard = ({ notifications = [] }) => (
  <div className="card" style={{ padding: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <Bell size={16} color="var(--color-primary)" />
      <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: "var(--color-text-primary)" }}>
        Notifications
      </h3>
    </div>

    {notifications.length === 0 && (
      <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>No new notifications.</p>
    )}

    {notifications.map((n) => {
      const style = ICON_STYLES[n.type] || ICON_STYLES.info;

      return (
        <div
          key={n.id}
          className="row-hover"
          style={{ display: "flex", gap: 10, padding: "9px 8px", borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="icon-circle" style={{ background: style.bg, width: 30, height: 30 }}>
            {style.icon}
          </div>
          <div>
            <div style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{n.message}</div>
            <div style={{ fontSize: 11.5, color: "var(--color-text-muted)", marginTop: 2 }}>{n.time}</div>
          </div>
        </div>
      );
    })}
  </div>
);

export default NotificationCard;