import { useState } from "react";
import { CandleFlame } from "./Atmosphere.jsx";
import { DIFFICULTY_SETTINGS } from "../data/cases.js";
import { getStreak, getDailySeed } from "../data/storage.js";

export function MenuScreen({ difficulty, setDifficulty, onStart, onDaily, onLeaderboard, onAchievements, onKillerMode, playerName, setPlayerName }) {
  const streak = getStreak();
  const { isNew: dailyIsNew } = getDailySeed();
  const [nameInput, setNameInput] = useState(playerName);

  function saveName(v) {
    setNameInput(v);
    setPlayerName(v);
    localStorage.setItem("mm_player_name", v);
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.candles}>
          <CandleFlame size={24} />
          <CandleFlame size={32} />
          <CandleFlame size={24} />
        </div>
        <h1 style={s.title}>The Blackwood<br />Murder</h1>
        <p style={s.sub}>An AI-Powered Murder Mystery · 1923</p>

        {streak.current > 0 && (
          <div style={s.streakBadge}>🔥 {streak.current}-case solve streak!</div>
        )}

        <div style={s.divider} />

        <div style={s.fieldWrap}>
          <label style={s.fieldLabel}>Your Detective Name</label>
          <input style={s.nameInput} value={nameInput} onChange={e => saveName(e.target.value)} placeholder="Anonymous Detective" maxLength={24} />
        </div>

        <div style={s.diffLabel}>Choose Difficulty</div>
        <div style={s.diffRow}>
          {Object.entries(DIFFICULTY_SETTINGS).map(([key, d]) => (
            <button key={key}
              style={{ ...s.diffBtn, border: `1px solid ${difficulty === key ? d.color : "rgba(180,140,60,0.15)"}`, background: difficulty === key ? `rgba(${key === "easy" ? "126,203,160" : key === "medium" ? "201,168,76" : "224,112,112"},0.1)` : "rgba(255,255,255,0.02)" }}
              onClick={() => setDifficulty(key)}>
              <div style={{ ...s.diffName, color: d.color }}>{d.label}</div>
              <div style={s.diffTurns}>{d.turns} turns</div>
              <div style={s.diffDesc}>{d.description}</div>
            </button>
          ))}
        </div>

        <button style={s.startBtn} onClick={onStart}>🔍 Begin Investigation →</button>
        <button style={s.dailyBtn} onClick={onDaily}>📅 Daily Mystery {dailyIsNew ? "· NEW TODAY" : "· Already played"}</button>

        {/* KILLER MODE — highlighted */}
        <button style={s.killerBtn} onClick={onKillerMode}>
          🎭 Play as the Killer — Survive Interrogation
        </button>

        <div style={s.secondaryRow}>
          <button style={s.secondaryBtn} onClick={onLeaderboard}>🏆 Leaderboard</button>
          <button style={s.secondaryBtn} onClick={onAchievements}>🎖 Achievements</button>
        </div>

        <p style={s.hint}>Each game generates a random case. No two games are alike.</p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", zIndex: 2 },
  card: { background: "rgba(10,8,4,0.88)", border: "1px solid rgba(180,140,60,0.25)", borderRadius: 12, padding: "34px 34px 26px", maxWidth: 520, width: "100%", textAlign: "center", backdropFilter: "blur(8px)" },
  candles: { display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 12, marginBottom: 16 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700, color: "#c9a84c", lineHeight: 1.15, marginBottom: 8 },
  sub: { fontFamily: "'Special Elite', monospace", fontSize: 11, color: "#5a4a2a", letterSpacing: "0.12em", marginBottom: 10 },
  streakBadge: { display: "inline-block", background: "rgba(180,140,60,0.1)", border: "1px solid rgba(180,140,60,0.25)", borderRadius: 20, padding: "4px 14px", fontSize: 13, color: "#c9a84c", marginBottom: 8 },
  divider: { borderTop: "1px solid rgba(180,140,60,0.15)", margin: "14px 0" },
  fieldWrap: { marginBottom: 16, textAlign: "left" },
  fieldLabel: { fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a4a2a", display: "block", marginBottom: 6 },
  nameInput: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(180,140,60,0.15)", borderRadius: 6, padding: "9px 12px", color: "#d4c9b0", fontSize: 14, fontFamily: "'Crimson Pro', serif" },
  diffLabel: { fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#5a4a2a", marginBottom: 10, textAlign: "left" },
  diffRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 },
  diffBtn: { borderRadius: 8, padding: "10px 7px", cursor: "pointer", transition: "all 0.2s" },
  diffName: { fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 700, marginBottom: 3 },
  diffTurns: { fontSize: 11, color: "#8a7a5a", marginBottom: 3 },
  diffDesc: { fontSize: 10, color: "#5a4a2a", lineHeight: 1.4 },
  startBtn: { width: "100%", padding: "13px", background: "#c9a84c", border: "none", borderRadius: 8, color: "#080604", fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em", marginBottom: 8 },
  dailyBtn: { width: "100%", padding: "9px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(180,140,60,0.15)", borderRadius: 8, color: "#8a7a5a", fontFamily: "'Crimson Pro', serif", fontSize: 13, cursor: "pointer", marginBottom: 8 },
  killerBtn: { width: "100%", padding: "11px", background: "rgba(120,40,40,0.2)", border: "1px solid rgba(180,60,60,0.35)", borderRadius: 8, color: "#e07878", fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10, letterSpacing: "0.02em" },
  secondaryRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 },
  secondaryBtn: { padding: "9px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(180,140,60,0.12)", borderRadius: 6, color: "#6a5a3a", fontSize: 13, cursor: "pointer", fontFamily: "'Crimson Pro', serif" },
  hint: { fontSize: 11, color: "#3a3020", fontStyle: "italic" },
};
