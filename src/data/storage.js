// Storage keys
const KEYS = {
  leaderboard: "mm_leaderboard",
  history: "mm_case_history",
  streak: "mm_streak",
  lastPlayed: "mm_last_played",
  dailySeed: "mm_daily_seed",
  achievements: "mm_achievements",
};

export function saveResult({ name, score, difficulty, correct, turns, caseVictim, rank }) {
  // Leaderboard
  const board = getLeaderboard();
  board.push({
    name: name || "Anonymous",
    score,
    difficulty,
    correct,
    turns,
    caseVictim,
    rank,
    date: new Date().toISOString(),
  });
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem(KEYS.leaderboard, JSON.stringify(board.slice(0, 20)));

  // Case history
  const history = getCaseHistory();
  history.unshift({ score, difficulty, correct, turns, caseVictim, rank, date: new Date().toISOString() });
  localStorage.setItem(KEYS.history, JSON.stringify(history.slice(0, 50)));

  // Streak
  updateStreak(correct);
}

export function getLeaderboard() {
  try { return JSON.parse(localStorage.getItem(KEYS.leaderboard) || "[]"); }
  catch { return []; }
}

export function getCaseHistory() {
  try { return JSON.parse(localStorage.getItem(KEYS.history) || "[]"); }
  catch { return []; }
}

export function getStreak() {
  try { return JSON.parse(localStorage.getItem(KEYS.streak) || '{"current":0,"best":0}'); }
  catch { return { current: 0, best: 0 }; }
}

function updateStreak(correct) {
  const streak = getStreak();
  const last = localStorage.getItem(KEYS.lastPlayed);
  const today = new Date().toDateString();
  if (correct) {
    if (last === today) {
      // already played today, don't double count
    } else {
      streak.current += 1;
      streak.best = Math.max(streak.best, streak.current);
    }
  } else {
    streak.current = 0;
  }
  localStorage.setItem(KEYS.streak, JSON.stringify(streak));
  localStorage.setItem(KEYS.lastPlayed, today);
}

export function getDailySeed() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem(KEYS.dailySeed);
  if (stored) {
    const { date, seed } = JSON.parse(stored);
    if (date === today) return { seed, isNew: false };
  }
  // Generate new seed from date
  const seed = today.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 3;
  localStorage.setItem(KEYS.dailySeed, JSON.stringify({ date: today, seed }));
  return { seed, isNew: true };
}

export function saveAchievements(achievements) {
  localStorage.setItem(KEYS.achievements, JSON.stringify(achievements));
}

export function loadAchievements() {
  try { return JSON.parse(localStorage.getItem(KEYS.achievements) || "[]"); }
  catch { return []; }
}

export function generateShareText({ score, rank, correct, difficulty, caseVictim, turns }) {
  const result = correct ? "SOLVED ✅" : "FAILED ❌";
  const stars = score >= 80 ? "⭐⭐⭐" : score >= 50 ? "⭐⭐" : "⭐";
  return `🕵️ AI Murder Mystery\n\nCase: ${caseVictim}\nResult: ${result}\nScore: ${score}/100 ${stars}\nRank: ${rank}\nDifficulty: ${difficulty}\nTurns used: ${turns}\n\nPlay at: github.com/your-username/murder-mystery`;
}
