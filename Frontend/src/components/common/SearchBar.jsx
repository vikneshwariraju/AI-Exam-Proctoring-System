import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "8px 12px", background: "#fff" }}>
    <Search size={15} color="var(--color-text-muted)" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ border: "none", outline: "none", fontSize: 13.5, flex: 1, background: "transparent" }}
    />
  </div>
);

export default SearchBar;