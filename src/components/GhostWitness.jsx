import { useState } from "react";

const API_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const GHOST_HINTS = [
  "The brandy... the brandy was not meant for me...",
  "He smiled when I turned my back. A doctor's smile.",
  "Follow the love letter. Follow the love.",
  "The poison smells of almonds. A medical scent.",
  "He visited twice that night. Once before. Once after.",
  "Check the medical bag. What is missing from it?",
  "She knew. She always knew. Ask her about James.",
];

export function GhostWitness({ victim, onClueFound }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usedHints, setUsedHints] = useState(0);
  const [input, setInput] = useState("");

  async function askGhost(q) {
    if (loading || usedHints >= 3) return;
    const question = q || input.trim();
    if (!question) return;
    setInput("");
    setLoading(true);
    setUsedHints(u => u + 1);
    setMessages(prev => [...prev, { type: "you", text: question }]);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 120,
          system: `You are the ghost of ${victim}, recently murdered. You can only communicate in fragmented, cryptic whispers. You know who killed you and how, but the veil between worlds prevents clear speech.

The truth: You were poisoned by Dr. Mercer using a rare alkaloid in your brandy. His motive: protecting his affair with Lady Vivienne and securing her inheritance.

Rules:
- Speak in broken, ethereal fragments. 1-2 sentences max.
- Be cryptic but contain a real clue somewhere.
- Sound otherworldly and unsettling.
- Never name the killer directly — hint through imagery and broken phrases.`,
          messages: [{ role: "user", content: question }]
        })
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "...";
      setMessages(prev => [...prev, { type: "ghost", text: reply }]);
      onClueFound?.(`Ghost: ${reply.slice(0, 40)}...`);
    } catch {
      setMessages(prev => [...prev, { type: "ghost", text: "...the connection fades..." }]);
    }
    setLoading(false);
  }

  const quickQuestions = [
    "Who killed you?",
    "How did they do it?",
    "What should I look for?",
  ];

  return (
    <>
      <button style={s.triggerBtn} onClick={() => setOpen(true)}>
        👻 Consult the Ghost
        {usedHints > 0 && <span style={s.badge}>{3 - usedHints} left</span>}
      </button>

      {open && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.header}>
              <div>
                <h3 style={s.title}>👻 Spirit of {victim}</h3>
                <p style={s.sub}>The veil is thin tonight... ({3 - usedHints} questions remaining)</p>
              </div>
              <button style={s.closeBtn} onClick={() => setOpen(false)}>✕</button>
            </div>

            <div style={s.chat}>
              {messages.length === 0 && (
                <div style={s.emptyMsg}>Speak into the void, Detective. The spirit is listening...</div>
              )}
              {messages.map((m, i) => (
                <div key={i} style={m.type === "ghost" ? s.ghostMsg : s.youMsg}>
                  {m.type === "ghost" && <span style={s.ghostLabel}>👻 </span>}
                  {m.text}
                </div>
              ))}
              {loading && <div style={s.ghostMsg}>👻 <em style={{ color: "#6a5a7a" }}>...reaching through the veil...</em></div>}
            </div>

            {usedHints < 3 && (
              <>
                <div style={s.quickRow}>
                  {quickQuestions.map(q => (
                    <button key={q} style={s.quickBtn} onClick={() => askGhost(q)}>{q}</button>
                  ))}
                </div>
                <div style={s.inputRow}>
                  <input style={s.input} value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && askGhost()}
                    placeholder="Ask the spirit..." disabled={loading} />
                  <button style={s.askBtn} onClick={() => askGhost()} disabled={loading || !input.trim()}>Ask</button>
                </div>
              </>
            )}
            {usedHints >= 3 && (
              <div style={s.exhausted}>The spirit has faded. No more questions can be asked.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const s = {
  triggerBtn: { width: "100%", padding: "8px", background: "rgba(80,40,100,0.2)", border: "1px solid rgba(140,80,180,0.25)", borderRadius: 6, color: "#c090e0", fontSize: 12, cursor: "pointer", fontFamily: "'Crimson Pro', serif", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  badge: { background: "rgba(140,80,180,0.3)", borderRadius: 10, padding: "1px 7px", fontSize: 10, color: "#a070c0" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150, padding: 20 },
  modal: { background: "rgba(8,4,16,0.98)", border: "1px solid rgba(140,80,180,0.3)", borderRadius: 12, padding: 24, maxWidth: 500, width: "100%", backdropFilter: "blur(8px)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#c090e0", marginBottom: 4 },
  sub: { fontSize: 12, color: "#5a4a6a", fontStyle: "italic" },
  closeBtn: { background: "none", border: "none", color: "#5a4a6a", cursor: "pointer", fontSize: 18 },
  chat: { minHeight: 180, maxHeight: 240, overflowY: "auto", marginBottom: 14, paddingRight: 4 },
  emptyMsg: { color: "#4a3a5a", fontStyle: "italic", fontSize: 13, textAlign: "center", padding: "30px 0" },
  ghostMsg: { background: "rgba(80,40,120,0.1)", border: "1px solid rgba(140,80,180,0.15)", borderRadius: 6, padding: "8px 12px", marginBottom: 8, color: "#c090e0", fontSize: 14, fontStyle: "italic", lineHeight: 1.65 },
  ghostLabel: { fontSize: 16 },
  youMsg: { textAlign: "right", padding: "8px 12px", marginBottom: 8, color: "#c9a84c", fontSize: 14, background: "rgba(180,140,60,0.06)", borderRadius: 6, border: "1px solid rgba(180,140,60,0.1)" },
  quickRow: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 },
  quickBtn: { fontSize: 12, padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(140,80,180,0.2)", background: "transparent", color: "#8060a0", cursor: "pointer", fontFamily: "'Crimson Pro', serif" },
  inputRow: { display: "flex", gap: 8 },
  input: { flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(140,80,180,0.2)", borderRadius: 6, padding: "10px 13px", color: "#d4c9b0", fontSize: 14, fontFamily: "'Crimson Pro', serif" },
  askBtn: { padding: "10px 16px", background: "rgba(140,80,180,0.3)", border: "1px solid rgba(140,80,180,0.4)", borderRadius: 6, color: "#c090e0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Crimson Pro', serif" },
  exhausted: { textAlign: "center", color: "#5a4a6a", fontStyle: "italic", fontSize: 13, padding: "12px 0" },
};
