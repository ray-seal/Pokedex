// components/SatNav.js
import { counties } from "../data/regions";

export default function SatNav({ currentCounty, onChange }) {
  return (
    <div style={{
      position: "fixed",
      left: 0,
      top: "30%",
      zIndex: 200,
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 2px 12px #0002",
      padding: "1em",
      minWidth: 180
    }}>
      <label htmlFor="satnav-select" style={{ fontWeight: "bold", marginBottom: 4, display: "block", color: "#222" }}>
        🛰️ SatNav
      </label>
      <select
        id="satnav-select"
        value={currentCounty}
        style={{ width: "100%", padding: "0.5em", borderRadius: 6, color: "#222" }}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Choose county…</option>
        {counties.map(county => (
          <option
            key={county.id}
            value={county.id}
            disabled={county.id !== "Kent"}
          >
            {county.name} {county.id !== "Kent" ? "🔒" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
