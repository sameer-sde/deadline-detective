export function NewspaperScreen({ verdict, activeCase, score, rank, difficulty, onPlayAgain }) {
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const killer = activeCase?.suspects.find(s => s.guilty);

  return (
    <div style={s.page}>
      <div style={s.paper} className="paperSlide">
        <style>{`
          @keyframes paperSlide { from{transform:translateY(-40px) rotate(-1deg);opacity:0} to{transform:translateY(0) rotate(0);opacity:1} }
          .paperSlide { animation: paperSlide 0.6s ease forwards; }
        `}</style>

        {/* Masthead */}
        <div style={s.masthead}>
          <div style={s.maststars}>✦ ✦ ✦</div>
          <h1 style={s.mastTitle}>The Blackwood Gazette</h1>
          <div style={s.mastMeta}>
            <span>Est. 1842</span>
            <span style={{ margin: "0 12px" }}>—</span>
            <span>{date}</span>
            <span style={{ margin: "0 12px" }}>—</span>
            <span>LATE EDITION · ONE PENNY</span>
          </div>
          <div style={s.maststars}>✦ ✦ ✦</div>
        </div>

        <div style={s.divider} />

        {/* Headline */}
        <div style={s.headline}>
          {verdict?.correct ? (
            <>
              <h2 style={s.headlineMain}>MURDER SOLVED!</h2>
              <p style={s.headlineSub}>
                {killer?.name} Arrested for the Murder of {activeCase?.victim} —<br />
                Scotland Yard Commends Detective's Brilliant Work
              </p>
            </>
          ) : (
            <>
              <h2 style={{ ...s.headlineMain, fontSize: 36 }}>KILLER ESCAPES!</h2>
              <p style={s.headlineSub}>
                Wrong Suspect Accused — {killer?.name} Vanishes Into the Night<br />
                Case Remains Unsolved as Fog Descends on the Manor
              </p>
            </>
          )}
        </div>

        <div style={s.divider} />

        {/* Two column article */}
        <div style={s.columns}>
          <div style={s.col}>
            <p style={s.dropCap}>
              <span style={s.drop}>{verdict?.correct ? "I" : "F"}</span>
              {verdict?.correct
                ? `n a stunning turn of events, the investigation into the death of ${activeCase?.victim} has been brought to a close. The accused, ${killer?.name}, was apprehended in the drawing room of the manor following a masterful interrogation by the attending detective.`
                : `ailure has struck the halls of justice tonight. The investigation into the murder of ${activeCase?.victim} has ended in embarrassment, with an innocent party wrongly accused. The true killer, ${killer?.name}, slipped away under cover of darkness.`
              }
            </p>
            <p style={s.body}>
              {verdict?.correct
                ? `The method of killing — ${activeCase?.weapon} — was confirmed by Scotland Yard's forensic specialists. Sources close to the investigation suggest the motive stemmed from a complex web of personal intrigue and financial desperation that had gone unnoticed for months.`
                : `Witnesses at the scene described the detective as visibly shaken upon realising the error. The true culprit, ${killer?.name}, had concealed their guilt behind a facade of calm and cooperation throughout questioning.`
              }
            </p>
          </div>
          <div style={s.col}>
            {/* Score card */}
            <div style={s.scoreCard}>
              <div style={s.scoreTitle}>DETECTIVE'S REPORT</div>
              <div style={s.scoreNum}>{score}</div>
              <div style={s.scoreLabel}>Points Earned</div>
              <div style={s.rankBadge}>
                <span style={{ fontSize: 24 }}>{rank?.icon}</span>
                <span style={{ marginLeft: 8, fontFamily: "'Playfair Display', serif", fontSize: 15 }}>{rank?.label}</span>
              </div>
              <div style={s.diffBadge}>Difficulty: {difficulty?.toUpperCase()}</div>
            </div>
            <p style={s.body}>
              {verdict?.correct
                ? `The detective's rank has been elevated following this outstanding performance. ${rank?.label} — a title well earned through sharp questioning and careful observation.`
                : `Scotland Yard has expressed disappointment. Further training is recommended before the detective is assigned another case of this magnitude.`
              }
            </p>
          </div>
        </div>

        <div style={s.divider} />

        {/* Play again */}
        <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
          <button style={s.playBtn} onClick={onPlayAgain}>
            ↻ Take Another Case
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", zIndex: 10 },
  paper: { background: "#f4ede0", color: "#1a1008", maxWidth: 700, width: "100%", borderRadius: 4, padding: "40px 48px", boxShadow: "0 20px 60px rgba(0,0,0,0.8)", border: "2px solid #d4c090" },
  masthead: { textAlign: "center", marginBottom: 12 },
  maststars: { color: "#8a6a20", fontSize: 12, letterSpacing: "0.3em", marginBottom: 6 },
  mastTitle: { fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: "#1a1008", letterSpacing: "0.05em", lineHeight: 1 },
  mastMeta: { fontFamily: "'Special Elite', monospace", fontSize: 11, color: "#6a5020", marginTop: 8, letterSpacing: "0.08em" },
  divider: { borderTop: "2px solid #1a1008", margin: "12px 0", borderBottom: "1px solid #1a1008", paddingBottom: 2 },
  headline: { textAlign: "center", padding: "16px 0" },
  headlineMain: { fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 700, lineHeight: 1, color: "#1a1008", marginBottom: 10 },
  headlineSub: { fontFamily: "'Crimson Pro', serif", fontSize: 17, color: "#3a2810", lineHeight: 1.5 },
  columns: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, padding: "16px 0" },
  col: {},
  dropCap: { fontFamily: "'Crimson Pro', serif", fontSize: 14, lineHeight: 1.7, color: "#1a1008", marginBottom: 10 },
  drop: { float: "left", fontFamily: "'Playfair Display', serif", fontSize: 52, lineHeight: 0.8, marginRight: 4, marginTop: 6, color: "#1a1008", fontWeight: 700 },
  body: { fontFamily: "'Crimson Pro', serif", fontSize: 13, lineHeight: 1.7, color: "#3a2810", marginTop: 8 },
  scoreCard: { background: "#1a1008", color: "#d4c9b0", borderRadius: 4, padding: "16px", marginBottom: 12, textAlign: "center", border: "2px solid #8a6a20" },
  scoreTitle: { fontFamily: "'Special Elite', monospace", fontSize: 10, letterSpacing: "0.2em", color: "#8a6a20", marginBottom: 8 },
  scoreNum: { fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, color: "#c9a84c", lineHeight: 1 },
  scoreLabel: { fontSize: 11, color: "#6a5a3a", marginTop: 2, fontFamily: "'Special Elite', monospace" },
  rankBadge: { display: "flex", alignItems: "center", justifyContent: "center", marginTop: 12, color: "#d4c9b0" },
  diffBadge: { marginTop: 8, fontSize: 11, fontFamily: "'Special Elite', monospace", color: "#8a6a20", letterSpacing: "0.1em" },
  playBtn: { fontFamily: "'Playfair Display', serif", fontSize: 16, background: "#1a1008", color: "#c9a84c", border: "2px solid #8a6a20", borderRadius: 4, padding: "12px 32px", cursor: "pointer", letterSpacing: "0.05em" },
};
