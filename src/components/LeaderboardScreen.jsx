import { useState } from "react";
import { getLeaderboard, getCaseHistory, getStreak } from "../data/storage.js";

const DIFF_COLOR = { easy: "#7ecba0", medium: "#c9a84c", hard: "#e07070" };

export function LeaderboardScreen({ onBack }) {
  const [tab, setTab] = useState("leaderboard");
  const board = getLeaderboard();
  const history = getCaseHistory();
  const streak = getStreak();

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <h2 style={s.title}>🏆 Hall of Records</h2>
          <button style={s.backBtn} onClick={onBack}>← Back</button>
        </div>

        {/* Streak banner */}
        <div style={s.streakBanner}>
          <div style={s.streakItem}>
            <span style={s.streakNum}>{streak.current}</span>
            <span style={s.streakLabel}>Current Streak 🔥</span>
          </div>
          <div style={s.streakDivider} />
          <div style={s.streakItem}>
            <span style={s.streakNum}>{streak.best}</span>
            <span style={s.streakLabel}>Best Streak 🎯</span>
          </div>
          <div style={s.streakDivider} />
          <div style={s.streakItem}>
            <span style={s.streakNum}>{history.length}</span>
            <span style={s.streakLabel}>Cases Played 📋</span>
          </div>
          <div style={s.streakDivider} />
          <div style={s.streakItem}>
            <span style={s.streakNum}>{history.filter(h => h.correct).length}</span>
            <span style={s.streakLabel}>Cases Solved ✅</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={s.tabRow}>
          {["leaderboard", "history"].map(t => (
            <button key={t} style={{ ...s.tabBtn, ...(tab === t ? s.tabActive : {}) }} onClick={() => setTab(t)}>
              {t === "leaderboard" ? "🏆 Leaderboard" : "📋 Case History"}
            </button>
          ))}
        </div>

        {tab === "leaderboard" && (
          <div>
            {board.length === 0 ? (
              <div style={s.empty}>No scores yet. Play a game to appear here!</div>
            ) : (
              board.map((entry, i) => (
                <div key={i} style={{ ...s.row, ...(i === 0 ? s.rowFirst : i === 1 ? s.rowSecond : i === 2 ? s.rowThird : {}) }}>
                  <span style={s.rank}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                  <div style={s.rowInfo}>
                    <div style={s.rowName}>{entry.name}</div>
                    <div style={s.rowMeta}>
                      <span style={{ color: DIFF_COLOR[entry.difficulty] || "#c9a84c" }}>{entry.difficulty}</span>
                      <span style={s.dot}>·</span>
                      <span>{entry.caseVictim}</span>
                      <span style={s.dot}>·</span>
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={s.rowRight}>
                    <span style={s.score}>{entry.score}</span>
                    <span style={s.scoreLabel}>pts</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "history" && (
          <div>
            {history.length === 0 ? (
              <div style={s.empty}>No cases played yet. Start investigating!</div>
            ) : (
              history.map((entry, i) => (
                <div key={i} style={s.historyRow}>
                  <span style={{ fontSize: 18 }}>{entry.correct ? "✅" : "❌"}</span>
                  <div style={s.rowInfo}>
                    <div style={s.rowName}>{entry.caseVictim}</div>
                    <div style={s.rowMeta}>
                      <span style={{ color: DIFF_COLOR[entry.difficulty] || "#c9a84c" }}>{entry.difficulty}</span>
                      <span style={s.dot}>·</span>
                      <span>{entry.rank}</span>
                      <span style={s.dot}>·</span>
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span style={{ ...s.score, color: entry.correct ? "#7ecba0" : "#e07070" }}>{entry.score}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px 20px", position: "relative", zIndex: 10 },
  card: { background: "rgba(10,8,4,0.92)", border: "1px solid rgba(180,140,60,0.25)", borderRadius: 12, padding: "28px 28px", maxWidth: 580, width: "100%", backdropFilter: "blur(8px)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#c9a84c" },
  backBtn: { background: "none", border: "1px solid rgba(180,140,60,0.2)", borderRadius: 6, color: "#6a5a3a", fontSize: 13, padding: "6px 12px", cursor: "pointer", fontFamily: "'Crimson Pro', serif" },
  streakBanner: { display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr", alignItems: "center", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(180,140,60,0.15)", borderRadius: 8, padding: "14px 20px", marginBottom: 20 },
  streakItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  streakNum: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#c9a84c", lineHeight: 1 },
  streakLabel: { fontSize: 10, color: "#5a4a2a", letterSpacing: "0.08em", textAlign: "center" },
  streakDivider: { width: 1, height: 40, background: "rgba(180,140,60,0.15)" },
  tabRow: { display: "flex", gap: 8, marginBottom: 16 },
  tabBtn: { flex: 1, padding: "9px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(180,140,60,0.12)", borderRadius: 6, color: "#5a4a2a", fontSize: 13, cursor: "pointer", fontFamily: "'Crimson Pro', serif" },
  tabActive: { background: "rgba(180,140,60,0.1)", border: "1px solid rgba(180,140,60,0.35)", color: "#c9a84c" },
  row: { display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 7, border: "1px solid rgba(180,140,60,0.08)", marginBottom: 6, background: "rgba(255,255,255,0.02)" },
  rowFirst: { border: "1px solid rgba(255,215,0,0.25)", background: "rgba(255,215,0,0.04)" },
  rowSecond: { border: "1px solid rgba(192,192,192,0.2)", background: "rgba(192,192,192,0.03)" },
  rowThird: { border: "1px solid rgba(205,127,50,0.2)", background: "rgba(205,127,50,0.03)" },
  historyRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 7, border: "1px solid rgba(180,140,60,0.08)", marginBottom: 6 },
  rank: { fontSize: 18, width: 28, textAlign: "center", flexShrink: 0 },
  rowInfo: { flex: 1 },
  rowName: { fontFamily: "'Playfair Display', serif", fontSize: 14, color: "#d4c9b0", marginBottom: 2 },
  rowMeta: { fontSize: 11, color: "#4a3a20", display: "flex", gap: 4, alignItems: "center" },
  dot: { color: "#3a2a10" },
  rowRight: { display: "flex", alignItems: "baseline", gap: 3 },
  score: { fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#c9a84c" },
  scoreLabel: { fontSize: 10, color: "#5a4a2a" },
  empty: { textAlign: "center", color: "#4a3a20", fontStyle: "italic", fontSize: 14, padding: "30px 0" },
};
