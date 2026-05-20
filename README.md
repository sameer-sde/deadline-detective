# 🕯️ Deadline Detective

> An AI-powered 1920s murder mystery game. Interrogate suspects, collect clues, and name the killer — before your turns run out.

**Live Demo:** [deadline-detective.vercel.app](https://deadline-detective.vercel.app)

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🎮 Game Modes

| Mode | Description |
|------|-------------|
| 🔍 **Detective Mode** | Interrogate 3 AI suspects and solve the murder |
| 🎭 **Killer Mode** | YOU are the murderer — survive Scotland Yard's interrogation |
| 📅 **Daily Mystery** | New case every day, same for everyone (like Wordle) |

---

## ✨ Features

**Gameplay**
- 🤖 Every suspect powered by Claude AI — unique answers every game
- 🎲 3 random murder cases — different victim, weapon, motive each game
- 3 difficulty levels — Constable, Detective, Scotland Yard
- ⏳ Turn-based pressure — limited questions, choose wisely

**Detective Tools**
- 📡 Lie Detector — fills up as suspects get nervous
- 🗺️ Clickable Crime Scene Map — inspect 6 rooms, find hidden clues
- 🔬 Fingerprint Scanner — canvas-drawn prints with animated scan
- 🗂️ Secret Documents — 4 locked documents to unlock
- 📒 Detective's Notebook — write your own notes

**Atmosphere**
- 🌧️ Live rain animation on canvas
- ⚡ Lightning flashes
- 🌫️ Fog effects
- 🕯️ Flickering candle with glow
- 💥 Screen shake on aggressive questions

**Progression**
- 🏆 Leaderboard — top 20 scores saved locally
- 🎖️ 6 Achievement badges
- 🔥 Streak tracker
- 📊 Full case history
- 📰 Vintage newspaper ending screen
- 📤 Shareable score card

**Phase 4 Extras**
- 👻 Ghost Witness — ask the victim's spirit for cryptic clues (3 questions)
- 🔊 Voice Mode — suspects speak using British text-to-speech
- 🎭 Killer Mode — AI detective interrogates YOU

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Anthropic API key → [console.anthropic.com](https://console.anthropic.com)

### Installation

```bash
# 1. Clone the repo
git clone [https://github.com/YOUR_USERNAME/deadline-detective.git](https://github.com/YOUR_USERNAME/deadline-detective.git)
cd deadline-detective

# 2. Install dependencies
npm install

# 3. Add your API key
cp .env.example .env.local
# Edit .env.local:
# VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here

# 4. Start the game
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI & state management |
| Vite 5 | Build tool & dev server |
| Claude Sonnet 4 | AI suspect characters |
| Canvas API | Rain animation & fingerprints |
| Web Speech API | Voice mode |
| localStorage | Leaderboard & achievements |
| Playfair Display + Crimson Pro | Period typography |

---

## 📁 Project Structure

```bash
deadline-detective/
├── src/
│   ├── components/
│   │   ├── Atmosphere.jsx       # Rain, lightning, fog, candles
│   │   ├── LieDetector.jsx      # Nervousness meter
│   │   ├── CrimeSceneMap.jsx    # Clickable SVG manor map
│   │   ├── FingerprintScanner.jsx # Canvas fingerprint mini-game
│   │   ├── SecretDocuments.jsx  # Locked document viewer
│   │   ├── GhostWitness.jsx     # AI ghost cryptic hints
│   │   ├── KillerMode.jsx       # Reverse interrogation mode
│   │   ├── VoiceMode.jsx        # Text-to-speech for suspects
│   │   ├── LeaderboardScreen.jsx
│   │   ├── ShareCard.jsx
│   │   ├── AchievementsGallery.jsx
│   │   ├── NewspaperScreen.jsx
│   │   └── MenuScreen.jsx
│   ├── hooks/
│   │   └── useGame.js           # All game logic
│   ├── data/
│   │   ├── cases.js             # Cases, suspects, achievements
│   │   └── storage.js           # localStorage utilities
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── .env.example
└── README.md
```

---

## 🚢 Deploy Free on Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Add `VITE_ANTHROPIC_API_KEY` in Environment Variables
4. Deploy ✅

---

## 🤝 Contributing

Pull requests welcome!

1. Fork the repo
2. Create branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT — free to use, fork, and build on.

⭐ **Star the repo if you enjoyed playing!**
