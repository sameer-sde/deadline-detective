import { useState, useRef } from "react";

const API_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const YOUR_SECRET = "You poisoned Lord Blackwood's brandy using a rare alkaloid you obtained through a black market contact. Your motive: he was about to change his will and cut you off entirely. You need to hide this at all costs.";

const DETECTIVE_SYSTEM = `You are Detective Inspector Harold Cole of Scotland Yard — sharp, methodical, intimidating. You are interrogating a suspect in the murder of Lord Blackwood.

The suspect's secret: ${YOUR_SECRET}

Your job:
- Ask probing, clever questions one at a time. No monologuing.
- React to their answers — call out inconsistencies, press on weak points.
- Be intimidating but professional. 1920s British detective style.
- Keep each response to 2-3 sentences max ending with ONE question.
- After 8 exchanges, decide if you believe they are guilty and append: [VERDICT: guilty] or [VERDICT: innocent]
- Never reveal what you know directly — make them slip up.`;

export function KillerMode({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [history, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const chatRef = useRef(null);

  function scroll() {
    setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 50);
  }

  function addMsg(msg) {
    setMessages(prev => [...prev, msg]);
    scroll();
  }

  async function start() {
    setStarted(true);
    setLoading(true);
    addMsg({ type: "narrator", text: "Detective Cole enters the room and sits across from you. He places a folder on the table and stares at you for a long moment." });

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          system: DETECTIVE_SYSTEM,
          messages: [{ role: "user", content: "Begin the interrogation. Open with a strong first question." }]
        })
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "";
      const clean = reply.replace(/\[VERDICT:.*?\]/g, "").trim();
      setChatHistory([{ role: "user", content: "Begin the interrogation." }, { role: "assistant", content: clean }]);
      addMsg({ type: "detective", text: clean });
    } catch {
      addMsg({ type: "narrator", text: "The detective clears his throat..." });
    }
    setLoading(false);
  }

  async function sendAnswer() {
    if (!input.trim() || loading || verdict) return;
    const ans = input.trim();
    setInput("");
    setLoading(true);
    const newTurn = turnCount + 1;
    setTurnCount(newTurn);

    addMsg({ type: "player", text: ans });
    const updatedHistory = [...history, { role: "user", content: ans }];

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          system: DETECTIVE_SYSTEM + (newTurn >= 8 ? "\n\nThis is the final exchange. Deliver your verdict now using [VERDICT: guilty] or [VERDICT: innocent]." : ""),
          messages: updatedHistory
        })
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "";
      const verdictMatch = reply.match(/\[VERDICT:\s*(guilty|innocent)\]/i);
      const clean = reply.replace(/\[VERDICT:.*?\]/g, "").trim();

      setChatHistory([...updatedHistory, { role: "assistant", content: clean }]);
      addMsg({ type: "detective", text: clean });

      if (verdictMatch) {
        const v = verdictMatch[1].toLowerCase();
        setVerdict(v);
        setTimeout(() => {
          addMsg({
            type: v === "guilty" ? "lose" : "win",
            text: v === "guilty"
              ? "⛓ ARRESTED. Detective Cole stands up slowly. \"I've heard enough. You're under arrest for the murder of Lord Blackwood.\" You failed to hide your guilt."
              : "🎭 FREE TO GO. Detective Cole closes his folder. \"You may leave, for now. But I'll be watching.\" You got away with murder — for now."
          });
        }, 500);
      }
    } catch {
      addMsg({ type: "narrator", text: "*The detective scribbles in his notebook*" });
    }
    setLoading(false);
  }

  const pressureColor = turnCount < 3 ? "#7ecba0" : turnCount < 6 ? "#c9a84c" : "#e07070";

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <div>
            <h2 style={s.title}>🎭 You Are the Killer</h2>
            <p style={s.sub}>Survive the interrogation without confessing</p>
          </div>
          <button style={s.backBtn} onClick={onBack}>← Back</button>
        </div>

        {!started ? (
          <div style={s.intro}>
            <div style={s.introCard}>
              <p style={s.introText}>
                Lord Blackwood is dead. <strong style={{ color: "#c9a84c" }}>You killed him.</strong><br /><br />
                You poisoned his brandy using a rare alkaloid. Now Detective Cole of Scotland Yard wants to question you. Your goal: <strong style={{ color: "#7ecba0" }}>lie convincingly and walk free.</strong>
              </p>
              <div style={s.secretBox}>
                <p style={s.secretLabel}>YOUR SECRET (don't reveal this):</p>
                <p style={s.secretText}>{YOUR_SECRET}</p>
              </div>
            </div>
            <button style={s.startBtn} onClick={start}>Enter the Interrogation Room →</button>
          </div>
        ) : (
          <>
            {/* Pressure meter */}
            <div style={s.pressureWrap}>
              <span style={s.pressureLabel}>Pressure Level</span>
              <div style={s.pressureTrack}>
                <div style={{ ...s.pressureFill, width: `${Math.min(100, turnCount * 12.5)}%`, background: pressureColor }} />
              </div>
              <span style={{ fontSize: 11, color: pressureColor, fontFamily: "monospace" }}>Q{turnCount}/8</span>
            </div>

            <div ref={chatRef} style={s.chat}>
              {messages.map((m, i) => (
                <div key={i} style={msgSt(m.type)}>
                  {m.type === "detective" && <span style={{ fontWeight: 600, color: "#7eb8ff" }}>Detective Cole: </span>}
                  {m.type === "player" && <span style={{ fontWeight: 600, color: "#c9a84c" }}>You: </span>}
                  {m.text}
                </div>
              ))}
              {loading && (
                <div style={msgSt("detective")}>
                  <span style={{ fontWeight: 600, color: "#7eb8ff" }}>Detective Cole: </span>
                  <span style={{ fontStyle: "italic", color: "#4a3a20" }}>...</span>
                </div>
              )}
            </div>

            {!verdict && (
              <div style={s.inputRow}>
                <input style={s.input} value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendAnswer()}
                  placeholder="Give your answer carefully..." disabled={loading} />
                <button style={s.sendBtn} onClick={sendAnswer} disabled={loading || !input.trim()}>Answer →</button>
              </div>
            )}

            {verdict && (
              <button style={{ ...s.startBtn, marginTop: 16 }} onClick={onBack}>← Play Again</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function msgSt(type) {
  const b = { marginBottom: 10, lineHeight: 1.7, fontSize: 15, padding: "10px 14px", borderRadius: 6 };
  if (type === "detective") return { ...b, color: "#d4c9b0", background: "rgba(100,140,255,0.05)", border: "1px solid rgba(100,140,255,0.1)" };
  if (type === "player") return { ...b, color: "#c9a84c", background: "rgba(180,140,60,0.07)", textAlign: "right", border: "1px solid rgba(180,140,60,0.12)" };
  if (type === "narrator") return { ...b, color: "#7a6a4a", fontStyle: "italic", background: "transparent", padding: "4px 0" };
  if (type === "win") return { ...b, color: "#7ecba0", background: "rgba(80,160,100,0.08)", border: "1px solid rgba(80,160,100,0.2)", textAlign: "center" };
  if (type === "lose") return { ...b, color: "#e07070", background: "rgba(160,80,80,0.08)", border: "1px solid rgba(160,80,80,0.2)", textAlign: "center" };
  return b;
}

const s = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px 20px", position: "relative", zIndex: 10 },
  card: { background: "rgba(10,8,4,0.92)", border: "1px solid rgba(180,140,60,0.25)", borderRadius: 12, padding: 28, maxWidth: 620, width: "100%", backdropFilter: "blur(8px)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#c9a84c", marginBottom: 4 },
  sub: { fontSize: 13, color: "#5a4a2a", fontStyle: "italic" },
  backBtn: { background: "none", border: "1px solid rgba(180,140,60,0.2)", borderRadius: 6, color: "#6a5a3a", fontSize: 13, padding: "6px 12px", cursor: "pointer", fontFamily: "'Crimson Pro', serif", flexShrink: 0 },
  intro: {},
  introCard: { background: "rgba(0,0,0,0.3)", border: "1px solid rgba(180,140,60,0.15)", borderRadius: 8, padding: 20, marginBottom: 20 },
  introText: { fontSize: 15, color: "#9a8a6a", lineHeight: 1.7, marginBottom: 16 },
  secretBox: { background: "rgba(180,40,40,0.08)", border: "1px solid rgba(180,60,60,0.2)", borderRadius: 6, padding: 14 },
  secretLabel: { fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8a4a4a", marginBottom: 6 },
  secretText: { fontSize: 13, color: "#c09090", lineHeight: 1.6 },
  startBtn: { width: "100%", padding: "13px", background: "#c9a84c", border: "none", borderRadius: 8, color: "#080604", fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  pressureWrap: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "8px 0" },
  pressureLabel: { fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a3a20", flexShrink: 0 },
  pressureTrack: { flex: 1, height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" },
  pressureFill: { height: "100%", borderRadius: 3, transition: "width 0.5s ease, background 0.5s ease" },
  chat: { minHeight: 300, maxHeight: 380, overflowY: "auto", marginBottom: 14, paddingRight: 4 },
  inputRow: { display: "flex", gap: 8 },
  input: { flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(180,140,60,0.15)", borderRadius: 6, padding: "11px 14px", color: "#d4c9b0", fontSize: 14, fontFamily: "'Crimson Pro', serif" },
  sendBtn: { padding: "11px 20px", background: "#c9a84c", border: "none", borderRadius: 6, color: "#080604", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Crimson Pro', serif", flexShrink: 0 },
};
