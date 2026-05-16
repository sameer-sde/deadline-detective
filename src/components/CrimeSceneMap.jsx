import { useState } from "react";

const ROOMS = [
  { id: "study", label: "Lord's Study", x: 60, y: 60, w: 160, h: 110, clue: "Brandy glass — no fingerprints", icon: "📚", desc: "The locked room where the body was found. A glass of brandy sits untouched." },
  { id: "kitchen", label: "Kitchen", x: 260, y: 60, w: 130, h: 110, clue: "Poison bottle fragment", icon: "🍳", desc: "A shattered vial was found behind the flour jars. Smells of bitter almonds." },
  { id: "drawing", label: "Drawing Room", x: 430, y: 60, w: 150, h: 110, clue: "Muddy footprints — size 10", icon: "🛋️", desc: "Three suspects were gathered here. Muddy prints lead toward the study." },
  { id: "garden", label: "Garden", x: 60, y: 210, w: 130, h: 100, clue: "Torn jacket fabric on fence", icon: "🌿", desc: "Someone climbed the east fence. A torn piece of dark wool was found." },
  { id: "library", label: "Library", x: 230, y: 210, w: 140, h: 100, clue: "Medical journal — page torn", icon: "📖", desc: "A medical reference book was found open. A page about alkaloid poisons is missing." },
  { id: "hallway", label: "Hallway", x: 410, y: 210, w: 170, h: 100, clue: "Candle wax — recently burned", icon: "🕯️", desc: "A candle was recently lit and snuffed. Someone was moving through here in the dark." },
];

export function CrimeSceneMap({ onClueFound }) {
  const [discovered, setDiscovered] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [flash, setFlash] = useState(null);

  function inspectRoom(room) {
    setActiveRoom(room);
    if (!discovered.includes(room.id)) {
      setDiscovered(prev => [...prev, room.id]);
      setFlash(room.id);
      onClueFound?.(room.clue);
      setTimeout(() => setFlash(null), 800);
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <span style={s.title}>🗺 Crime Scene Map</span>
        <span style={s.sub}>{discovered.length}/{ROOMS.length} rooms inspected</span>
      </div>

      {/* Map SVG */}
      <div style={s.mapWrap}>
        <svg viewBox="0 0 620 330" style={{ width: "100%", borderRadius: 6 }}>
          {/* Background */}
          <rect width="620" height="330" fill="#0e0a06" rx="6" />
          {/* Grid lines */}
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 22} x2="620" y2={i * 22} stroke="rgba(180,140,60,0.05)" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 28 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 22} y1="0" x2={i * 22} y2="330" stroke="rgba(180,140,60,0.05)" strokeWidth="0.5" />
          ))}

          {/* Connecting corridors */}
          <line x1="220" y1="115" x2="260" y2="115" stroke="rgba(180,140,60,0.2)" strokeWidth="8" strokeLinecap="round" />
          <line x1="390" y1="115" x2="430" y2="115" stroke="rgba(180,140,60,0.2)" strokeWidth="8" strokeLinecap="round" />
          <line x1="125" y1="170" x2="125" y2="210" stroke="rgba(180,140,60,0.2)" strokeWidth="8" strokeLinecap="round" />
          <line x1="325" y1="170" x2="325" y2="210" stroke="rgba(180,140,60,0.2)" strokeWidth="8" strokeLinecap="round" />
          <line x1="495" y1="170" x2="495" y2="210" stroke="rgba(180,140,60,0.2)" strokeWidth="8" strokeLinecap="round" />
          <line x1="190" y1="260" x2="230" y2="260" stroke="rgba(180,140,60,0.2)" strokeWidth="8" strokeLinecap="round" />
          <line x1="370" y1="260" x2="410" y2="260" stroke="rgba(180,140,60,0.2)" strokeWidth="8" strokeLinecap="round" />

          {ROOMS.map(room => {
            const isDiscovered = discovered.includes(room.id);
            const isActive = activeRoom?.id === room.id;
            const isFlashing = flash === room.id;
            return (
              <g key={room.id} style={{ cursor: "pointer" }} onClick={() => inspectRoom(room)}>
                <rect
                  x={room.x} y={room.y} width={room.w} height={room.h} rx="4"
                  fill={isFlashing ? "rgba(200,168,76,0.3)" : isActive ? "rgba(180,140,60,0.15)" : "rgba(255,255,255,0.03)"}
                  stroke={isDiscovered ? "rgba(180,140,60,0.6)" : "rgba(180,140,60,0.15)"}
                  strokeWidth={isActive ? 1.5 : 1}
                />
                {/* Room icon */}
                <text x={room.x + room.w / 2} y={room.y + 38} textAnchor="middle" fontSize="20">{room.icon}</text>
                {/* Room label */}
                <text x={room.x + room.w / 2} y={room.y + 62} textAnchor="middle" fontSize="11" fill={isDiscovered ? "#c9a84c" : "#6a5a3a"} fontFamily="'Crimson Pro', serif">{room.label}</text>
                {/* Clue indicator */}
                {isDiscovered && (
                  <g>
                    <circle cx={room.x + room.w - 10} cy={room.y + 10} r="7" fill="rgba(200,168,76,0.2)" stroke="rgba(180,140,60,0.5)" strokeWidth="1" />
                    <text x={room.x + room.w - 10} y={room.y + 14} textAnchor="middle" fontSize="9" fill="#c9a84c">✓</text>
                  </g>
                )}
                {/* Inspect hint */}
                {!isDiscovered && (
                  <text x={room.x + room.w / 2} y={room.y + 80} textAnchor="middle" fontSize="9" fill="#3a3020" fontFamily="'Crimson Pro', serif">click to inspect</text>
                )}
              </g>
            );
          })}

          {/* Compass */}
          <text x="590" y="320" textAnchor="middle" fontSize="10" fill="#3a3020" fontFamily="'Crimson Pro', serif">N↑</text>
        </svg>
      </div>

      {/* Room detail */}
      {activeRoom && (
        <div style={s.detail}>
          <div style={s.detailIcon}>{activeRoom.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={s.detailRoom}>{activeRoom.label}</div>
            <div style={s.detailDesc}>{activeRoom.desc}</div>
            {discovered.includes(activeRoom.id) && (
              <div style={s.detailClue}>🔍 Clue found: <span style={{ color: "#c9a84c" }}>{activeRoom.clue}</span></div>
            )}
          </div>
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
  mapWrap: { border: "1px solid rgba(180,140,60,0.1)", borderRadius: 6, overflow: "hidden", marginBottom: 12 },
  detail: { display: "flex", gap: 12, background: "rgba(180,140,60,0.05)", border: "1px solid rgba(180,140,60,0.15)", borderRadius: 6, padding: 12 },
  detailIcon: { fontSize: 24 },
  detailRoom: { fontFamily: "'Playfair Display', serif", fontSize: 13, color: "#c9a84c", marginBottom: 4 },
  detailDesc: { fontSize: 13, color: "#8a7a5a", lineHeight: 1.5, marginBottom: 6 },
  detailClue: { fontSize: 12, color: "#7a6a4a" },
};
