import React from "react";

// Rewritten to use plain inline styles instead of Tailwind utility classes
// (bg-blue-600, text-white, etc.) -- this project doesn't have Tailwind
// installed, so those classes were rendering as no-ops, leaving every
// Button completely unstyled.
const VARIANT_STYLES = {
  primary: {
    background: "linear-gradient(90deg, #2563EB, #4F46E5)",
    color: "#ffffff",
    border: "none",
  },
  secondary: {
    background: "#F1F5F9",
    color: "#334155",
    border: "none",
  },
  danger: {
    background: "#DC2626",
    color: "#ffffff",
    border: "none",
  },
};

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  style = {},
}) => {
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        padding: "9px 18px",
        borderRadius: 10,
        fontWeight: 600,
        fontSize: 13.5,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "0.2s",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        ...variantStyle,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export default Button;