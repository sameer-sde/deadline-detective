// Voice synthesis utilities for suspect characters

const VOICES = {
  butler: { pitch: 0.9, rate: 0.85, voice: "British" },
  niece: { pitch: 1.2, rate: 0.95, voice: "British" },
  doctor: { pitch: 0.85, rate: 0.9, voice: "British" },
  detective: { pitch: 0.8, rate: 0.88, voice: "British" },
};

let currentUtterance = null;

export function speak(text, suspectId = "butler", onEnd) {
  if (!window.speechSynthesis) return;
  stop();

  const clean = text.replace(/[*_~]/g, "").slice(0, 300);
  const utterance = new SpeechSynthesisUtterance(clean);
  const config = VOICES[suspectId] || VOICES.butler;

  // Try to find a British voice
  const voices = window.speechSynthesis.getVoices();
  const britishVoice = voices.find(v =>
    v.lang.includes("en-GB") || v.name.includes("British") || v.name.includes("Daniel") || v.name.includes("Kate")
  );
  if (britishVoice) utterance.voice = britishVoice;

  utterance.pitch = config.pitch;
  utterance.rate = config.rate;
  utterance.volume = 0.9;
  if (onEnd) utterance.onend = onEnd;

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stop() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeaking() {
  return window.speechSynthesis?.speaking || false;
}

export function VoiceButton({ text, suspectId, label = "🔊" }) {
  function toggle() {
    if (isSpeaking()) { stop(); return; }
    speak(text, suspectId);
  }

  return (
    <button
      onClick={toggle}
      title="Listen to this response"
      style={{
        background: "none",
        border: "1px solid rgba(180,140,60,0.2)",
        borderRadius: 4,
        color: "#6a5a3a",
        fontSize: 11,
        padding: "2px 8px",
        cursor: "pointer",
        marginLeft: 8,
        fontFamily: "'Crimson Pro', serif",
        verticalAlign: "middle",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}
