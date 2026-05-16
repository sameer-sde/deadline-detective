import { useState } from "react";

const DOCUMENTS = [
  {
    id: "will",
    label: "Lord's Will",
    icon: "📜",
    locked: true,
    unlockHint: "Ask about the inheritance",
    content: `LAST WILL AND TESTAMENT\nof Lord Edmund Blackwood\n\n...I hereby bequeath the entirety of my estate, valued at £240,000, to my niece Lady Vivienne Cross, on the condition that she remain unmarried at time of my death.\n\nShould she be found to be in any romantic arrangement, the estate shall pass to the Blackwood Charitable Foundation.\n\n— Signed, Lord E. Blackwood\n— Witnessed by Dr. J. Mercer`,
  },
  {
    id: "letter",
    label: "Anonymous Letter",
    icon: "✉️",
    locked: true,
    unlockHint: "Ask about secret correspondence",
    content: `[Found tucked beneath the brandy decanter]\n\n"You have until Friday to change the will or I will reveal everything to Scotland Yard. You know what you did in Cairo. Do not test me.\n\n— A Friend"`,
  },
  {
    id: "prescription",
    label: "Medical Prescription",
    icon: "💊",
    locked: false,
    unlockHint: null,
    content: `BLACKWOOD MANOR MEDICAL RECORDS\nDr. James Mercer — Private Practice\n\nPatient: Lord E. Blackwood\nDate: 14 November 1923\n\nPrescribed: Digitalis tincture — 2 drops nightly\nNote: Patient complained of chest pains. Advised rest.\n\n[Handwritten note in margin: "Alkaloid compound — check dosage interactions — J.M."]`,
  },
  {
    id: "diary",
    label: "Lady's Diary",
    icon: "📓",
    locked: true,
    unlockHint: "Ask Lady Vivienne about her feelings",
    content: `Nov 12 — James came again tonight. Uncle must never find out. If he changes the will I lose everything. James says not to worry — he will "handle it." I asked what he meant. He only smiled.\n\nNov 14 — Uncle is dead. I cannot breathe. James is so calm. Too calm.`,
  },
];

export function SecretDocuments({ onClueFound, unlockedDocs = [] }) {
  const [unlocked, setUnlocked] = useState(["prescription", ...unlockedDocs]);
  const [activeDoc, setActiveDoc] = useState(null);

  function tryUnlock(doc) {
    if (unlocked.includes(doc.id)) {
      setActiveDoc(doc);
    } else {
      // Unlock after 1.5s "searching"
      setTimeout(() => {
        setUnlocked(prev => [...prev, doc.id]);
        setActiveDoc(doc);
        onClueFound?.(`Document found: ${doc.label}`);
      }, 1200);
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <span style={s.title}>🗂 Secret Documents</span>
        <span style={s.sub}>{unlocked.length}/{DOCUMENTS.length} unlocked</span>
      </div>

      <div style={s.docGrid}>
        {DOCUMENTS.map(doc => {
          const isUnlocked = unlocked.includes(doc.id);
          return (
            <button
              key={doc.id}
              style={{ ...s.docBtn, ...(isUnlocked ? s.docUnlocked : s.docLocked) }}
              onClick={() => tryUnlock(doc)}
            >
              <span style={{ fontSize: 22, filter: isUnlocked ? "none" : "grayscale(1) opacity(0.4)" }}>{doc.icon}</span>
              <div style={s.docLabel}>{doc.label}</div>
              {!isUnlocked && <div style={s.docHint}>🔒 {doc.unlockHint}</div>}
              {isUnlocked && <div style={{ ...s.docHint, color: "#7ecba0" }}>✓ Unlocked</div>}
            </button>
          );
        })}
      </div>

      {activeDoc && (
        <div style={s.docViewer}>
          <div style={s.docViewerHeader}>
            <span style={s.docViewerTitle}>{activeDoc.icon} {activeDoc.label}</span>
            <button style={s.closeBtn} onClick={() => setActiveDoc(null)}>✕</button>
          </div>
          <pre style={s.docContent}>{activeDoc.content}</pre>
        </div>
      )}
    </div>
  );
}

const s = {
  wrap: { background: "rgba(0,0,0,0.4)", border: "1px solid rgba(180,140,60,0.2)", borderRadius: 8, padding: 16 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 14, color: "#c9a84c" },
  sub: { fontSize: 11, color: "#5a4a2a", fontFamily: "monospace" },
  docGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 },
  docBtn: { borderRadius: 6, padding: "10px 10px", cursor: "pointer", textAlign: "center", transition: "all 0.2s", border: "1px solid rgba(180,140,60,0.15)" },
  docUnlocked: { background: "rgba(180,140,60,0.08)", border: "1px solid rgba(180,140,60,0.3)" },
  docLocked: { background: "rgba(255,255,255,0.02)" },
  docLabel: { fontSize: 12, fontFamily: "'Playfair Display', serif", color: "#d4c9b0", marginTop: 6, marginBottom: 4 },
  docHint: { fontSize: 10, color: "#4a3a20", lineHeight: 1.4 },
  docViewer: { background: "rgba(244,237,224,0.06)", border: "1px solid rgba(180,140,60,0.2)", borderRadius: 6, padding: 14 },
  docViewerHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  docViewerTitle: { fontFamily: "'Playfair Display', serif", fontSize: 13, color: "#c9a84c" },
  closeBtn: { background: "none", border: "none", color: "#5a4a2a", cursor: "pointer", fontSize: 14 },
  docContent: { fontFamily: "'Special Elite', monospace", fontSize: 12, color: "#b8a880", lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0 },
};
