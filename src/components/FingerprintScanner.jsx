import { useState, useRef, useEffect } from "react";

const PRINTS = [
  { id: "a", label: "Sample A", owner: "Mr. Graves", match: true },
  { id: "b", label: "Sample B", owner: "Lady Vivienne", match: false },
  { id: "c", label: "Sample C", owner: "Dr. Mercer", match: false },
];

function drawFingerprint(ctx, x, y, radius, seed, color = "#c9a84c", opacity = 0.6) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.8;
  const rng = (n) => ((Math.sin(seed * 9301 + n * 49297) * 0.5 + 0.5));
  for (let i = 3; i < radius; i += 3.5) {
    ctx.beginPath();
    const distort = rng(i) * 4 - 2;
    for (let a = 0; a <= Math.PI * 2; a += 0.05) {
      const r = i + Math.sin(a * (3 + Math.floor(rng(i * 7) * 4)) + rng(i)) * (1.5 + rng(i * 3) * 2) + distort;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r * 1.3;
      a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();
}

export function FingerprintScanner({ onMatch }) {
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [selectedPrint, setSelectedPrint] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#080604";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw scene print (always same)
    drawFingerprint(ctx, 100, 80, 55, 42, "#c9a84c", 0.5);
    ctx.fillStyle = "#5a4a2a";
    ctx.font = "10px 'Crimson Pro', serif";
    ctx.fillText("Scene print", 65, 148);

    // Draw selected comparison print
    if (selectedPrint) {
      drawFingerprint(ctx, 260, 80, 55, selectedPrint.match ? 42 : selectedPrint.id === "b" ? 17 : 88, "#7eb8ff", 0.5);
      ctx.fillStyle = "#5a4a2a";
      ctx.font = "10px 'Crimson Pro', serif";
      ctx.fillText(selectedPrint.label, 230, 148);
    }

    // Scan line
    if (scanning) {
      ctx.fillStyle = "rgba(200,168,76,0.15)";
      ctx.fillRect(0, (scanProgress / 100) * canvas.height - 2, canvas.width, 4);
    }

    // Result overlay
    if (result !== null) {
      ctx.fillStyle = result ? "rgba(126,203,160,0.15)" : "rgba(224,112,112,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = result ? "#7ecba0" : "#e07070";
      ctx.font = "bold 16px 'Playfair Display', serif";
      ctx.textAlign = "center";
      ctx.fillText(result ? "MATCH FOUND" : "NO MATCH", canvas.width / 2, canvas.height / 2);
      ctx.font = "11px 'Crimson Pro', serif";
      ctx.fillStyle = "#8a7a5a";
      ctx.fillText(result ? `Print belongs to ${selectedPrint?.owner}` : "Prints do not match", canvas.width / 2, canvas.height / 2 + 20);
    }
  }, [scanning, scanProgress, result, selectedPrint]);

  function runScan() {
    if (!selectedPrint || scanning) return;
    setResult(null);
    setScanning(true);
    setScanProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      setScanProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setScanning(false);
        const matched = selectedPrint.match;
        setResult(matched);
        if (matched) onMatch?.(`${selectedPrint.owner}'s print matches scene`);
      }
    }, 40);
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <span style={s.title}>🔬 Fingerprint Scanner</span>
        <span style={s.sub}>Compare prints from suspects</span>
      </div>

      <canvas ref={canvasRef} width={360} height={160} style={s.canvas} />

      {scanning && (
        <div style={s.progressWrap}>
          <div style={{ ...s.progressFill, width: `${scanProgress}%` }} />
        </div>
      )}

      <div style={s.printRow}>
        {PRINTS.map(p => (
          <button
            key={p.id}
            style={{ ...s.printBtn, ...(selectedPrint?.id === p.id ? s.printBtnActive : {}) }}
            onClick={() => { setSelectedPrint(p); setResult(null); setScanProgress(0); }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <button style={s.scanBtn} onClick={runScan} disabled={!selectedPrint || scanning}>
        {scanning ? `Scanning... ${scanProgress}%` : "Run Scan →"}
      </button>
    </div>
  );
}

const s = {
  wrap: { background: "rgba(0,0,0,0.4)", border: "1px solid rgba(180,140,60,0.2)", borderRadius: 8, padding: 16 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 14, color: "#c9a84c" },
  sub: { fontSize: 11, color: "#5a4a2a" },
  canvas: { width: "100%", borderRadius: 6, border: "1px solid rgba(180,140,60,0.1)", display: "block", marginBottom: 10 },
  progressWrap: { height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden", marginBottom: 10 },
  progressFill: { height: "100%", background: "#c9a84c", borderRadius: 2, transition: "width 0.04s linear" },
  printRow: { display: "flex", gap: 8, marginBottom: 10 },
  printBtn: { flex: 1, padding: "7px 4px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(180,140,60,0.1)", borderRadius: 6, color: "#7a6a4a", fontSize: 12, cursor: "pointer", fontFamily: "'Crimson Pro', serif" },
  printBtnActive: { background: "rgba(180,140,60,0.12)", border: "1px solid rgba(180,140,60,0.4)", color: "#c9a84c" },
  scanBtn: { width: "100%", padding: "9px", background: "#c9a84c", border: "none", borderRadius: 6, color: "#080604", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Crimson Pro', serif" },
};
