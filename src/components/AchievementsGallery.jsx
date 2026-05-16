import { ACHIEVEMENTS } from "../data/cases.js";

export function AchievementsGallery({ unlocked, onClose }) {
  return (
    <div style={s.overlay}>
      <div style={s.card}>
        <div style={s.header}>
          <h2 style={s.title}>🎖 Achievements</h2>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <p style={s.sub}>{unlocked.length}/{ACHIEVEMENTS.length} unlocked</p>
        <div style={s.grid}>
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            return (
              <div key={ach.id} style={{ ...s.achCard, ...(isUnlocked ? s.achUnlocked : s.achLocked) }}>
                <span style={{ fontSize: 28, filter: isUnlocked ? "none" : "grayscale(1) opacity(0.3)" }}>{ach.icon}</span>
                <div style={{ ...s.achLabel, color: isUnlocked ? "#c9a84c" : "#3a3020" }}>{ach.label}</div>
                <div style={s.achDesc}>{ach.desc}</div>
                {isUnlocked && <div style={s.unlockBadge}>✓ Unlocked</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 },
  card: { background: "#0e0a06", border: "1px solid rgba(180,140,60,0.25)", borderRadius: 12, padding: 28, maxWidth: 500, width: "100%", maxHeight: "90vh", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#c9a84c" },
  closeBtn: { background: "none", border: "none", color: "#5a4a2a", cursor: "pointer", fontSize: 18 },
  sub: { fontSize: 13, color: "#4a3a20", fontStyle: "italic", marginBottom: 20 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  achCard: { borderRadius: 8, padding: "14px 12px", textAlign: "center", border: "1px solid rgba(180,140,60,0.1)", transition: "all 0.2s" },
  achUnlocked: { background: "rgba(180,140,60,0.08)", border: "1px solid rgba(180,140,60,0.3)" },
  achLocked: { background: "rgba(255,255,255,0.02)" },
  achLabel: { fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 600, marginTop: 8, marginBottom: 4 },
  achDesc: { fontSize: 11, color: "#4a3a20", lineHeight: 1.4 },
  unlockBadge: { marginTop: 6, fontSize: 10, color: "#7ecba0", letterSpacing: "0.1em" },
};
