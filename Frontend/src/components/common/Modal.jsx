import { X } from "lucide-react";

const Modal = ({ title, children, onClose, width = 400 }) => (
  <div
    style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}
    onClick={onClose}
  >
    <div
      style={{ background: "#fff", borderRadius: "var(--radius-lg)", padding: 28, width: "100%", maxWidth: width, boxShadow: "var(--shadow-lg)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 600, color: "var(--color-text-primary)" }}>{title}</h3>
        <X size={18} style={{ cursor: "pointer", color: "var(--color-text-secondary)" }} onClick={onClose} />
      </div>
      {children}
    </div>
  </div>
);

export default Modal;