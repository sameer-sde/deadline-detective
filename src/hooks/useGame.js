import { useState, useRef } from "react";
import { CASE_TEMPLATES, QUICK_QUESTIONS, DIFFICULTY_SETTINGS, RANKS, ACHIEVEMENTS } from "../data/cases.js";
import { saveResult, loadAchievements, saveAchievements, getDailySeed } from "../data/storage.js";

const API_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export function useGame() {
  const [screen, setScreen] = useState("menu");
  const [difficulty, setDifficulty] = useState("medium");
  const [activeCase, setActiveCase] = useState(null);
  const [activeSuspect, setActiveSuspect] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnsLeft, setTurnsLeft] = useState(10);
  const [clues, setClues] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [quickQs, setQuickQs] = useState([]);
  const [statusText, setStatusText] = useState("Idle");
  const [verdict, setVerdict] = useState(null);
  const [lieDetector, setLieDetector] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [notebook, setNotebook] = useState("");
  const [score, setScore] = useState(0);
  const [achievements, setAchievements] = useState(loadAchievements());
  const [newAchievement, setNewAchievement] = useState(null);
  const [isDaily, setIsDaily] = useState(false);
  const [playerName, setPlayerName] = useState(localStorage.getItem("mm_player_name") || "");
  const chatRef = useRef(null);

  function scrollChat() {
    setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 50);
  }

  function addMessage(msg) {
    setMessages(prev => [...prev, msg]);
    scrollChat();
  }

  function triggerShake() {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }

  function unlockAchievement(id) {
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach || achievements.includes(id)) return;
    const updated = [...achievements, id];
    setAchievements(updated);
    saveAchievements(updated);
    setNewAchievement(ach);
    setTimeout(() => setNewAchievement(null), 3000);
  }

  function addExternalClue(clue) {
    setClues(prev => prev.includes(clue) ? prev : [...prev, clue]);
  }

  function startGame(diff = difficulty, daily = false) {
    let caseTemplate;
    if (daily) {
      const { seed } = getDailySeed();
      caseTemplate = CASE_TEMPLATES[seed];
      setIsDaily(true);
    } else {
      caseTemplate = CASE_TEMPLATES[Math.floor(Math.random() * CASE_TEMPLATES.length)];
      setIsDaily(false);
    }
    const settings = DIFFICULTY_SETTINGS[diff];
    setActiveCase(caseTemplate);
    setDifficulty(diff);
    setActiveSuspect(null);
    setMessages([{ type: "narrator", text: `${caseTemplate.backstory} You have ${settings.turns} questions. The truth is buried somewhere in this manor — find it, Detective.` }]);
    setChatHistory([]);
    setInput("");
    setLoading(false);
    setTurnsLeft(settings.turns);
    setClues([]);
    setGameOver(false);
    setQuickQs([]);
    setStatusText("Idle");
    setVerdict(null);
    setLieDetector(0);
    setScore(0);
    setScreen("game");
  }

  function selectSuspect(id) {
    if (gameOver || !activeCase) return;
    const suspect = activeCase.suspects.find(s => s.id === id);
    setActiveSuspect(suspect);
    setChatHistory([]);
    setQuickQs(QUICK_QUESTIONS.start);
    setLieDetector(suspect.guilty ? 20 : 5);
    addMessage({ type: "narrator", text: `You sit across from ${suspect.name}. The candlelight casts long shadows across their face.` });
  }

  async function sendQuestion(q) {
    if (!activeSuspect || loading || gameOver || !q.trim() || !activeCase) return;
    setInput("");
    setLoading(true);
    setStatusText("Thinking...");
    setQuickQs([]);

    const newTurns = turnsLeft - 1;
    setTurnsLeft(newTurns);

    const userMsg = { role: "user", content: q };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    addMessage({ type: "player", text: q });

    const aggressive = ["you did it", "liar", "murderer", "confess", "guilty", "lying"].some(w => q.toLowerCase().includes(w));
    if (aggressive) triggerShake();

    const diff = DIFFICULTY_SETTINGS[difficulty];

    const systemPrompt = `You are ${activeSuspect.name} (${activeSuspect.role}) in a 1920s murder mystery set at ${activeCase.setting} in England.
The victim is ${activeCase.victim}. Weapon: ${activeCase.weapon}. Time: ${activeCase.time}.
Your secret: ${activeSuspect.secret}
Your personality: ${activeSuspect.personality}
You are guilty of murder: ${activeSuspect.guilty}
Difficulty: ${difficulty} (${diff.label})

Rules:
- Speak in authentic 1920s British dialect. Keep responses to 2-3 sentences.
- ${activeSuspect.guilty ? "You are the murderer. Be calm, charming, subtly deflect. Never confess." : "You are innocent but have your own secret. Be nervous but truthful about the murder."}
- Difficulty ${difficulty}: ${difficulty === "hard" ? "Be very evasive." : difficulty === "easy" ? "Drop clues easily." : "Balance helpfulness and evasion."}
- Clue frequency: ${diff.clueFrequency}. When dropping a clue append: [CLUE: label in 4 words max]
- When nervousness increases append: [LIE_SCORE: number 1-30]
- Never break character.`;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 250, system: systemPrompt, messages: updatedHistory }),
      });

      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "I have nothing to say.";
      const clueMatch = reply.match(/\[CLUE:\s*(.+?)\]/);
      const lieMatch = reply.match(/\[LIE_SCORE:\s*(\d+)\]/);
      const cleanReply = reply.replace(/\[CLUE:.*?\]/g, "").replace(/\[LIE_SCORE:.*?\]/g, "").trim();

      if (clueMatch) {
        const clue = clueMatch[1].trim();
        setClues(prev => {
          const updated = prev.includes(clue) ? prev : [...prev, clue];
          if (updated.length >= 5) unlockAchievement("clue_master");
          return updated;
        });
      }
      if (lieMatch) setLieDetector(prev => Math.min(100, prev + parseInt(lieMatch[1])));

      setChatHistory(prev => [...prev, { role: "assistant", content: cleanReply }]);
      addMessage({ type: "suspect", name: activeSuspect.name, text: cleanReply });
      setQuickQs(QUICK_QUESTIONS.follow);
      setStatusText("Listening");
    } catch {
      addMessage({ type: "narrator", text: "*glances away and straightens their collar*" });
      setStatusText("Error");
    }

    setLoading(false);
    if (newTurns <= 0) {
      setGameOver(true);
      addMessage({ type: "system", text: "Your time is up, Detective. Make your accusation now." });
    }
  }

  function makeAccusation(id) {
    if (!activeCase) return;
    const suspect = activeCase.suspects.find(s => s.id === id);
    const correct = suspect.guilty;
    setGameOver(true);

    const settings = DIFFICULTY_SETTINGS[difficulty];
    const turnsUsed = settings.turns - turnsLeft;
    const clueBonus = clues.length * 5;
    const speedBonus = Math.max(0, turnsLeft * 8);
    const diffBonus = difficulty === "hard" ? 30 : difficulty === "medium" ? 15 : 0;
    const finalScore = correct ? Math.min(100, 40 + clueBonus + speedBonus + diffBonus) : Math.max(0, 10 - turnsUsed);
    setScore(finalScore);

    const rankObj = getRank(finalScore);

    // Save to storage
    const name = playerName || localStorage.getItem("mm_player_name") || "Anonymous";
    saveResult({ name, score: finalScore, difficulty, correct, turns: turnsUsed, caseVictim: activeCase.victim, rank: rankObj?.label });

    // Achievements
    if (correct) {
      unlockAchievement("first_solve");
      if (turnsLeft >= 7) unlockAchievement("speed_demon");
      if (difficulty === "hard") unlockAchievement("mind_reader");
    } else {
      unlockAchievement("wrong_man");
      triggerShake();
    }

    setVerdict({ correct, name: suspect.name, score: finalScore });
    setTimeout(() => {
      addMessage({
        type: correct ? "win" : "lose",
        text: correct
          ? `⚖ CASE SOLVED. You've accused ${suspect.name} — correctly! Scotland Yard arrives within the hour. Brilliant work, Detective.`
          : `✗ WRONG ACCUSATION. You accused ${suspect.name}, but they were innocent. The real killer escapes into the night. Case goes cold.`,
      });
      setTimeout(() => setScreen("newspaper"), 2000);
    }, 400);
  }

  function getRank(sc) {
    return RANKS.find(r => sc >= r.min && sc <= r.max) || RANKS[0];
  }

  return {
    screen, setScreen,
    difficulty, setDifficulty,
    activeCase,
    activeSuspect,
    messages,
    input, setInput,
    loading,
    turnsLeft,
    clues,
    gameOver,
    quickQs,
    statusText,
    verdict,
    lieDetector,
    shaking,
    notebook, setNotebook,
    score,
    achievements,
    newAchievement,
    isDaily,
    playerName, setPlayerName,
    chatRef,
    startGame,
    selectSuspect,
    sendQuestion,
    makeAccusation,
    addExternalClue,
    getRank,
    unlockAchievement,
    DIFFICULTY_SETTINGS,
    ACHIEVEMENTS,
  };
}
