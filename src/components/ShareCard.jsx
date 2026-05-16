import { useRef } from "react";
import { generateShareText } from "../data/storage.js";

export function ShareCard({ verdict, score, rank, difficulty, activeCase, turnsLeft, DIFFICULTY_SETTINGS, onClose }) {
  const textRef = useRef(null);
  const turns = (DIFFICULTY_SETTINGS[difficulty]?.turns || 10) - turnsLeft;
  const shareText = generateShareText({
    score,
    rank: rank?.label,
    correct: verdict?.correct,
    difficulty,
    caseVictim: activeCase?.victim,
    turns,
  });

  function copyToClipboard() {
    navigator.clipboard.writeText(shareText).then(() => {
      const btn = document.getElementById("copy-btn");
      if (btn) { btn.textContent = "✓ Copied!"; setTimeout(() => btn.textContent = "📋 Copy to Clipboard", 2000); }
    });
  }

  const stars = score >= 80 ? "⭐⭐⭐" : score >= 50 ? "⭐⭐" : "⭐";
  const diffColor = { easy: "#7ecba0", medium: "#c9a84c", hard: "#e07070" }[difficulty] || "#c9a84c";

  return (
    <div style={s.overlay}>
      <div style={s.card}>
        <h2 style={s.title}>📤 Share Your Result</h2>

        {/* Visual card */}
        <div style={s.shareCard} ref={textRef}>
          <div style={s.shareHeader}>
            <span style={{ fontSize: 28 }}>🕵️</span>
            <div>
              <div style={s.shareGame}>AI Murder Mystery</div>
              <div style={s.shareCase}>Case: {activeCase?.victim}</div>
            </div>
          </div>
          <div style={s.shareResult}>
            <span style={{ fontSize: 32 }}>{verdict?.correct ? "✅" : "❌"}</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: verdict?.correct ? "#7ecba0" : "#e07070" }}>
              {verdict?.correct ? "CASE SOLVED" : "CASE FAILED"}
            </span>
          </div>
          <div style={s.shareStats}>
            <div style={s.shareStat}>
              <div style={{ ...s.shareStatNum, color: "#c9a84c" }}>{score}</div>
              <div style={s.shareStatLabel}>Score</div>
            </div>
            <div style={s.shareStat}>
              <div style={{ ...s.shareStatNum, fontSize: 18 }}>{rank?.icon}</div>
              <div style={s.shareStatLabel}>{rank?.label}</div>
            </div>
            <div style={s.shareStat}>
              <div style={{ ...s.shareStatNum, color: diffColor, fontSize: 16 }}>{difficulty?.toUpperCase()}</div>
              <div style={s.shareStatLabel}>Difficulty</div>
            </div>
            <div style={s.shareStat}>
              <div style={{ ...s.shareStatNum }}>{turns}</div>
              <div style={s.shareStatLabel}>Turns used</div>
            </div>
          </div>
          <div style={s.shareStars}>{stars}</div>
          <div style={s.shareFooter}>Play at: github.com/your-username/murder-mystery</div>
        </div>

        {/* Text to copy */}
        <div style={s.textBox}>
          <pre style={s.pre}>{shareText}</pre>
        </div>

        <div style={s.btnRow}>
          <button id="copy-btn" style={s.copyBtn} onClick={copyToClipboard}>📋 Copy to Clipboard</button>
          <button style={s.closeBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 },
  card: { background: "#0e0a06", border: "1px solid rgba(180,140,60,0.3)", borderRadius: 12, padding: 28, maxWidth: 440, width: "100%" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#c9a84c", marginBottom: 20, textAlign: "center" },
  shareCard: { background: "linear-gradient(135deg, #1a1208, #0e0a06)", border: "1px solid rgba(180,140,60,0.3)", borderRadius: 10, padding: 20, marginBottom: 16 },
  shareHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(180,140,60,0.15)" },
  shareGame: { fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#c9a84c" },
  shareCase: { fontSize: 12, color: "#5a4a2a", marginTop: 2 },
  shareResult: { display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 16 },
  shareStats: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 },
  shareStat: { textAlign: "center", background: "rgba(0,0,0,0.3)", borderRadius: 6, padding: "8px 4px" },
  shareStatNum: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#d4c9b0", lineHeight: 1, marginBottom: 4 },
  shareStatLabel: { fontSize: 9, color: "#4a3a20", letterSpacing: "0.08em", textTransform: "uppercase" },
  shareStars: { textAlign: "center", fontSize: 18, marginBottom: 10 },
  shareFooter: { textAlign: "center", fontSize: 10, color: "#3a3020", fontFamily: "monospace" },
  textBox: { background: "rgba(0,0,0,0.4)", border: "1px solid rgba(180,140,60,0.12)", borderRadius: 6, padding: 12, marginBottom: 14 },
  pre: { fontFamily: "monospace", fontSize: 12, color: "#8a7a5a", whiteSpace: "pre-wrap", margin: 0, lineHeight: 1.6 },
  btnRow: { display: "flex", gap: 8 },
  copyBtn: { flex: 2, padding: "10px", background: "#c9a84c", border: "none", borderRadius: 6, color: "#080604", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Crimson Pro', serif" },
  closeBtn: { flex: 1, padding: "10px", background: "transparent", border: "1px solid rgba(180,140,60,0.2)", borderRadius: 6, color: "#5a4a2a", fontSize: 13, cursor: "pointer", fontFamily: "'Crimson Pro', serif" },
};
