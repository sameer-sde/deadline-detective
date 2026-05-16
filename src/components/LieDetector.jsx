export function LieDetector({ value }) {
  const level = value < 30 ? "calm" : value < 60 ? "nervous" : value < 85 ? "agitated" : "lying";
  const color = value < 30 ? "#7ecba0" : value < 60 ? "#c9a84c" : value < 85 ? "#e07070" : "#ff3333";
  const label = { calm: "Calm", nervous: "Nervous", agitated: "Agitated", lying: "LYING" }[level];

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <span style={s.title}>Lie Detector</span>
        <span style={{ ...s.label, color }}>{label}</span>
      </div>
      <div style={s.track}>
        <div style={{
          ...s.fill,
          width: `${value}%`,
          background: `linear-gradient(to right, #7ecba0, ${color})`,
          boxShadow: value > 60 ? `0 0 8px ${color}60` : "none",
          transition: "width 0.8s ease, box-shadow 0.5s ease",
        }} />
        {/* Needle marks */}
        {[25, 50, 75].map(p => (
          <div key={p} style={{ position: "absolute", left: `${p}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.08)" }} />
        ))}
      </div>
      <div style={s.labels}>
        <span>Truthful</span>
        <span>Deceptive</span>
      </div>
    </div>
  );
}

const s = {
  wrap: { background: "rgba(0,0,0,0.3)", border: "1px solid rgba(180,140,60,0.15)", borderRadius: 8, padding: "10px 12px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a4a2a" },
  label: { fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.5s" },
  track: { height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden", position: "relative" },
  fill: { height: "100%", borderRadius: 4 },
  labels: { display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 10, color: "#4a3a20" },
};
