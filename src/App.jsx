import { useState } from "react";
import { useGame } from "./hooks/useGame.js";
import { Atmosphere, CandleFlame } from "./components/Atmosphere.jsx";
import { LieDetector } from "./components/LieDetector.jsx";
import { MenuScreen } from "./components/MenuScreen.jsx";
import { NewspaperScreen } from "./components/NewspaperScreen.jsx";
import { CrimeSceneMap } from "./components/CrimeSceneMap.jsx";
import { FingerprintScanner } from "./components/FingerprintScanner.jsx";
import { SecretDocuments } from "./components/SecretDocuments.jsx";
import { LeaderboardScreen } from "./components/LeaderboardScreen.jsx";
import { ShareCard } from "./components/ShareCard.jsx";
import { AchievementsGallery } from "./components/AchievementsGallery.jsx";
import { KillerMode } from "./components/KillerMode.jsx";
import { GhostWitness } from "./components/GhostWitness.jsx";
import { VoiceButton, stop as stopVoice } from "./components/VoiceMode.jsx";

const TABS = [
  { id: "interrogate", label: "🎙 Interrogate" },
  { id: "map", label: "🗺 Crime Scene" },
  { id: "fingerprint", label: "🔬 Fingerprints" },
  { id: "documents", label: "🗂 Documents" },
  { id: "notebook", label: "📒 Notebook" },
];

export default function App() {
  const game = useGame();
  const [accuseOpen, setAccuseOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("interrogate");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showKillerMode, setShowKillerMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const turnColor = game.turnsLeft > 5 ? "#c9a84c" : game.turnsLeft > 2 ? "#e07070" : "#ff3333";
  const diff = game.DIFFICULTY_SETTINGS[game.difficulty];
  const rank = game.getRank(game.score);

  // KILLER MODE
  if (showKillerMode) return (
    <div style={{ minHeight: "100vh", background: "#080604", position: "relative" }}>
      <Atmosphere />
      <KillerMode onBack={() => setShowKillerMode(false)} />
    </div>
  );

  // MENU
  if (game.screen === "menu") {
    if (showLeaderboard) return (
      <div style={{ minHeight: "100vh", background: "#080604", position: "relative" }}>
        <Atmosphere />
        <LeaderboardScreen onBack={() => setShowLeaderboard(false)} />
      </div>
    );
    if (showAchievements) return (
      <div style={{ minHeight: "100vh", background: "#080604", position: "relative" }}>
        <Atmosphere />
        <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AchievementsGallery unlocked={game.achievements} onClose={() => setShowAchievements(false)} />
        </div>
      </div>
    );
    return (
      <div style={{ minHeight: "100vh", background: "#080604", position: "relative" }}>
        <Atmosphere />
        <MenuScreen
          difficulty={game.difficulty} setDifficulty={game.setDifficulty}
          onStart={() => game.startGame()}
          onDaily={() => game.startGame(game.difficulty, true)}
          onLeaderboard={() => setShowLeaderboard(true)}
          onAchievements={() => setShowAchievements(true)}
          onKillerMode={() => setShowKillerMode(true)}
          playerName={game.playerName} setPlayerName={game.setPlayerName}
        />
      </div>
    );
  }

  // NEWSPAPER
  if (game.screen === "newspaper") return (
    <div style={{ minHeight: "100vh", background: "#080604", position: "relative" }}>
      <Atmosphere />
      {showShare && (
        <ShareCard verdict={game.verdict} score={game.score} rank={rank}
          difficulty={game.difficulty} activeCase={game.activeCase}
          turnsLeft={game.turnsLeft} DIFFICULTY_SETTINGS={game.DIFFICULTY_SETTINGS}
          onClose={() => setShowShare(false)} />
      )}
      <NewspaperScreen verdict={game.verdict} activeCase={game.activeCase}
        score={game.score} rank={rank} difficulty={game.difficulty}
        onPlayAgain={() => game.setScreen("menu")}
        onShare={() => setShowShare(true)}
        onLeaderboard={() => { game.setScreen("menu"); setTimeout(() => setShowLeaderboard(true), 100); }} />
    </div>
  );

  // GAME
  return (
    <div style={{ minHeight: "100vh", background: "#080604", position: "relative" }}>
      <Atmosphere />

      {game.newAchievement && (
        <div style={st.toast}>
          <span style={{ fontSize: 20 }}>{game.newAchievement.icon}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#c9a84c" }}>Achievement Unlocked!</div>
            <div style={{ fontSize: 12, color: "#8a7a5a" }}>{game.newAchievement.label}</div>
          </div>
        </div>
      )}

      {game.isDaily && <div style={st.dailyBadge}>📅 Daily Mystery</div>}

      <div style={{ ...st.layout, ...(game.shaking ? { animation: "shake 0.4s ease" } : {}) }}>
        {/* SIDEBAR */}
        <aside style={st.sidebar}>
          <div style={st.logo}>
            <CandleFlame size={20} />
            <h1 style={st.logoTitle}>Blackwood<br />Murder</h1>
            <p style={st.logoSub}>{diff?.label} · {game.playerName || "Detective"}</p>
          </div>

          <div>
            <p style={st.sLabel}>Suspects</p>
            {game.activeCase?.suspects.map(s => (
              <button key={s.id} style={{ ...st.suspectCard, ...(game.activeSuspect?.id === s.id ? st.suspectActive : {}) }}
                onClick={() => { game.selectSuspect(s.id); setActiveTab("interrogate"); stopVoice(); }} disabled={game.gameOver}>
                <span style={st.sIcon}>{s.icon}</span>
                <div>
                  <div style={st.sName}>{s.name}</div>
                  <div style={st.sRole}>{s.role}</div>
                </div>
              </button>
            ))}
          </div>

          {game.activeSuspect && <LieDetector value={game.lieDetector} />}

          <div style={{ flex: 1 }}>
            <p style={st.sLabel}>Evidence ({game.clues.length})</p>
            <div style={st.cluesBox}>
              {game.clues.length === 0
                ? <span style={{ fontSize: 11, color: "#3a3020", fontStyle: "italic" }}>None yet...</span>
                : game.clues.map((c, i) => <div key={i} style={st.clueItem}>🔍 {c}</div>)}
            </div>
          </div>

          {/* Ghost Witness */}
          {game.activeCase && (
            <GhostWitness victim={game.activeCase.victim} onClueFound={game.addExternalClue} />
          )}

          <div style={st.turnBox}>
            <div style={{ ...st.turnNum, color: turnColor }}>
              {game.gameOver && game.verdict ? (game.verdict.correct ? "✓" : "✗") : game.turnsLeft}
            </div>
            <div style={st.turnLabel}>turns left</div>
          </div>

          <button style={st.accuseBtn} onClick={() => setAccuseOpen(true)} disabled={game.gameOver}>⚖ Make Accusation</button>
          <button style={st.menuBtn} onClick={() => { game.setScreen("menu"); stopVoice(); }}>← Menu</button>
        </aside>

        {/* MAIN */}
        <main style={st.main}>
          <div style={st.tabBar}>
            {TABS.map(tab => (
              <button key={tab.id} style={{ ...st.tabBtn, ...(activeTab === tab.id ? st.tabActive : {}) }} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
            {/* Voice toggle */}
            <button
              style={{ ...st.tabBtn, marginLeft: "auto", color: voiceEnabled ? "#c9a84c" : "#3a3020" }}
              onClick={() => { setVoiceEnabled(v => !v); stopVoice(); }}
              title="Toggle voice mode"
            >
              {voiceEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
            </button>
          </div>

          <div style={st.tabContent}>
            {activeTab === "interrogate" && (
              <>
                <div style={st.chatHeader}>
                  <div>
                    <div style={st.interrogating}>{game.activeSuspect ? `Interrogating: ${game.activeSuspect.name}` : "Choose a suspect"}</div>
                    <div style={st.interrogatingRole}>{game.activeSuspect ? game.activeSuspect.role : "Select from the left panel"}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ ...st.dot, background: game.loading ? "#c9a84c" : "#2a2010", boxShadow: game.loading ? "0 0 8px rgba(200,160,60,0.7)" : "none" }} />
                    <span style={st.statusText}>{game.statusText}</span>
                  </div>
                </div>

                <div ref={game.chatRef} style={st.chatWindow}>
                  {game.messages.map((m, i) => (
                    <div key={i} style={msgSt(m.type)}>
                      {m.type === "player" && <span style={{ fontWeight: 600, color: "#c9a84c" }}>You: </span>}
                      {m.type === "suspect" && (
                        <>
                          <span style={{ fontWeight: 600, color: "#b8963c" }}>{m.name}: </span>
                          {voiceEnabled && m.text && (
                            <VoiceButton text={m.text} suspectId={game.activeSuspect?.id} />
                          )}
                        </>
                      )}
                      {m.text}
                    </div>
                  ))}
                  {game.loading && (
                    <div style={msgSt("suspect")}>
                      <span style={{ fontWeight: 600, color: "#b8963c" }}>{game.activeSuspect?.name}: </span>
                      <Dots />
                    </div>
                  )}
                </div>

                {game.quickQs.length > 0 && !game.gameOver && (
                  <div style={st.quickRow}>
                    {game.quickQs.map(q => <button key={q} style={st.quickBtn} onClick={() => game.sendQuestion(q)}>{q}</button>)}
                  </div>
                )}

                <div style={st.inputRow}>
                  <input style={st.input} value={game.input} onChange={e => game.setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && game.sendQuestion(game.input)}
                    placeholder={game.gameOver ? "Case closed." : game.activeSuspect ? `Ask ${game.activeSuspect.name}...` : "Select a suspect first..."}
                    disabled={!game.activeSuspect || game.loading || game.gameOver} />
                  <button style={{ ...st.sendBtn, ...(!game.activeSuspect || game.loading || game.gameOver || !game.input.trim() ? st.sendOff : {}) }}
                    onClick={() => game.sendQuestion(game.input)}
                    disabled={!game.activeSuspect || game.loading || game.gameOver || !game.input.trim()}>Ask →</button>
                </div>
              </>
            )}

            {activeTab === "map" && <CrimeSceneMap onClueFound={game.addExternalClue} />}
            {activeTab === "fingerprint" && <FingerprintScanner onMatch={game.addExternalClue} />}
            {activeTab === "documents" && <SecretDocuments onClueFound={game.addExternalClue} />}
            {activeTab === "notebook" && (
              <div style={st.notebookWrap}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#c9a84c" }}>📒 Detective's Notebook</span>
                  <span style={{ fontSize: 11, color: "#4a3a20" }}>{game.notebook.length} chars</span>
                </div>
                <textarea style={st.noteArea} value={game.notebook} onChange={e => game.setNotebook(e.target.value)}
                  placeholder={`Your observations...\n\nSuspects:\n- ...\n\nMy theory:\n...`} />
              </div>
            )}
          </div>
        </main>
      </div>

      {accuseOpen && (
        <div style={st.overlay}>
          <div style={st.modal}>
            <h2 style={st.modalTitle}>Make Your Accusation</h2>
            <p style={st.modalSub}>One shot. Choose wisely.</p>
            {game.activeCase?.suspects.map(s => (
              <button key={s.id} style={st.modalBtn} onClick={() => { setAccuseOpen(false); game.makeAccusation(s.id); }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#d4c9b0" }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "#6a5c3a" }}>{s.role}</div>
                </div>
              </button>
            ))}
            <button style={st.cancelBtn} onClick={() => setAccuseOpen(false)}>— Cancel —</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Dots() {
  return <span style={{ fontStyle: "italic", color: "#4a3a20" }}>
    {[0,1,2].map(i => <span key={i} style={{ animation: `blink 1.2s ${i*0.2}s infinite` }}>.</span>)}
    <style>{`@keyframes blink{0%,100%{opacity:0.2}50%{opacity:1}}`}</style>
  </span>;
}

function msgSt(type) {
  const b = { marginBottom: 10, lineHeight: 1.7, fontSize: 15, padding: "8px 12px", borderRadius: 6 };
  if (type === "player") return { ...b, background: "rgba(180,140,60,0.07)", color: "#c9a84c", textAlign: "right", border: "1px solid rgba(180,140,60,0.12)" };
  if (type === "suspect") return { ...b, color: "#d4c9b0", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" };
  if (type === "narrator") return { ...b, color: "#7a6a4a", fontStyle: "italic", background: "transparent", padding: "4px 0" };
  if (type === "system") return { ...b, color: "#6a9c7a", textAlign: "center", fontStyle: "italic", background: "transparent" };
  if (type === "win") return { ...b, color: "#7ecba0", background: "rgba(80,160,100,0.08)", border: "1px solid rgba(80,160,100,0.2)", textAlign: "center" };
  if (type === "lose") return { ...b, color: "#e07070", background: "rgba(160,80,80,0.08)", border: "1px solid rgba(160,80,80,0.2)", textAlign: "center" };
  return b;
}

const st = {
  layout: { position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "215px 1fr", minHeight: "100vh" },
  sidebar: { borderRight: "1px solid rgba(180,140,60,0.12)", padding: "16px 13px", background: "rgba(0,0,0,0.55)", display: "flex", flexDirection: "column", gap: 12, backdropFilter: "blur(4px)" },
  logo: { textAlign: "center", paddingBottom: 12, borderBottom: "1px solid rgba(180,140,60,0.1)" },
  logoTitle: { fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "#c9a84c", lineHeight: 1.3, marginTop: 5 },
  logoSub: { fontSize: 10, color: "#4a3a20", letterSpacing: "0.06em", marginTop: 2 },
  sLabel: { fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4a3a20", marginBottom: 7 },
  suspectCard: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(180,140,60,0.08)", borderRadius: 7, padding: "7px 9px", cursor: "pointer", marginBottom: 5, textAlign: "left", width: "100%", transition: "all 0.2s" },
  suspectActive: { background: "rgba(180,140,60,0.1)", border: "1px solid rgba(180,140,60,0.4)" },
  sIcon: { fontSize: 16, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(180,140,60,0.08)", borderRadius: "50%", border: "1px solid rgba(180,140,60,0.15)", flexShrink: 0 },
  sName: { fontSize: 12, fontWeight: 600, color: "#d4c9b0", fontFamily: "'Playfair Display', serif" },
  sRole: { fontSize: 10, color: "#4a3a20", marginTop: 1 },
  cluesBox: { background: "rgba(0,0,0,0.2)", border: "1px solid rgba(180,140,60,0.08)", borderRadius: 6, padding: 8, minHeight: 40 },
  clueItem: { fontSize: 11, color: "#b8963c", padding: "3px 0", borderBottom: "1px solid rgba(180,140,60,0.06)", lineHeight: 1.5 },
  turnBox: { textAlign: "center", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(180,140,60,0.12)", borderRadius: 6, padding: "8px" },
  turnNum: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, lineHeight: 1, transition: "color 0.5s" },
  turnLabel: { fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3a2a10", marginTop: 2 },
  accuseBtn: { width: "100%", padding: "8px", background: "rgba(100,30,30,0.2)", border: "1px solid rgba(160,60,60,0.25)", borderRadius: 6, color: "#e07878", fontSize: 12, cursor: "pointer", fontFamily: "'Crimson Pro', serif", fontWeight: 600 },
  menuBtn: { padding: "5px", background: "transparent", border: "none", color: "#3a3020", fontSize: 11, cursor: "pointer", fontFamily: "'Crimson Pro', serif", textAlign: "center" },
  main: { display: "flex", flexDirection: "column", minHeight: "100vh" },
  tabBar: { display: "flex", borderBottom: "1px solid rgba(180,140,60,0.12)", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", overflowX: "auto" },
  tabBtn: { padding: "11px 12px", background: "transparent", border: "none", borderBottom: "2px solid transparent", color: "#4a3a20", fontSize: 12, cursor: "pointer", fontFamily: "'Crimson Pro', serif", transition: "all 0.15s", whiteSpace: "nowrap" },
  tabActive: { color: "#c9a84c", borderBottom: "2px solid #c9a84c", background: "rgba(180,140,60,0.05)" },
  tabContent: { flex: 1, padding: "18px 20px", overflowY: "auto" },
  chatHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid rgba(180,140,60,0.1)", marginBottom: 12 },
  interrogating: { fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#c9a84c" },
  interrogatingRole: { fontSize: 11, color: "#4a3a20", fontStyle: "italic", marginTop: 2 },
  dot: { width: 7, height: 7, borderRadius: "50%", transition: "all 0.4s" },
  statusText: { fontSize: 10, color: "#3a3020", letterSpacing: "0.1em", textTransform: "uppercase" },
  chatWindow: { minHeight: 240, maxHeight: 320, overflowY: "auto", marginBottom: 12, paddingRight: 4 },
  quickRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  quickBtn: { fontSize: 12, padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(180,140,60,0.18)", background: "transparent", color: "#7a6a42", cursor: "pointer", fontFamily: "'Crimson Pro', serif" },
  inputRow: { display: "flex", gap: 8 },
  input: { flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(180,140,60,0.15)", borderRadius: 6, padding: "10px 13px", color: "#d4c9b0", fontSize: 14, fontFamily: "'Crimson Pro', serif" },
  sendBtn: { padding: "10px 18px", background: "#c9a84c", border: "none", borderRadius: 6, color: "#080604", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Crimson Pro', serif", flexShrink: 0 },
  sendOff: { background: "#1a1408", color: "#4a3a20", cursor: "not-allowed" },
  notebookWrap: { background: "rgba(0,0,0,0.3)", border: "1px solid rgba(180,140,60,0.15)", borderRadius: 8, padding: 18 },
  noteArea: { width: "100%", minHeight: 360, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(180,140,60,0.12)", borderRadius: 6, padding: 13, color: "#d4c9b0", fontSize: 14, lineHeight: 1.8, resize: "vertical", fontFamily: "'Crimson Pro', serif" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "#0e0a06", border: "1px solid rgba(180,140,60,0.25)", borderRadius: 10, padding: 26, width: 295 },
  modalTitle: { fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#c9a84c", marginBottom: 6 },
  modalSub: { fontSize: 13, color: "#5a4a2a", fontStyle: "italic", marginBottom: 16, lineHeight: 1.5 },
  modalBtn: { display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left", padding: "11px 13px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(180,140,60,0.1)", borderRadius: 8, cursor: "pointer", marginBottom: 7, fontFamily: "'Crimson Pro', serif" },
  cancelBtn: { width: "100%", padding: 9, background: "transparent", border: "none", color: "#4a3a20", fontSize: 13, cursor: "pointer", fontFamily: "'Crimson Pro', serif", marginTop: 3 },
  toast: { position: "fixed", top: 20, right: 20, zIndex: 200, background: "#0e0a06", border: "1px solid rgba(180,140,60,0.4)", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" },
  dailyBadge: { position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 50, background: "rgba(180,140,60,0.15)", border: "1px solid rgba(180,140,60,0.3)", borderRadius: 20, padding: "4px 14px", fontSize: 12, color: "#c9a84c", fontFamily: "'Crimson Pro', serif" },
};
