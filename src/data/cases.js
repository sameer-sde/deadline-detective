export const CASE_TEMPLATES = [
  {
    victim: "Lord Blackwood",
    setting: "his locked study",
    weapon: "rare alkaloid poison slipped into brandy",
    time: "11pm",
    suspects: [
      {
        id: "butler", name: "Mr. Graves", role: "The Butler", icon: "🧍",
        personality: "Flustered, defensive, clearly hiding something (theft) but innocent of murder. Nervously adjusts collar.",
        secret: "Has been stealing from Lord Blackwood for years. Was in the study at 9pm claiming to deliver brandy. Innocent of murder.",
        guilty: false,
      },
      {
        id: "niece", name: "Lady Vivienne", role: "The Niece", icon: "👩",
        personality: "Haughty, emotional, protective of her affair secret. Cooperative but grieving in her own cold way.",
        secret: "Stands to inherit everything. Had a heated argument about the will. Innocent but hiding her affair with Dr. Mercer.",
        guilty: false,
      },
      {
        id: "doctor", name: "Dr. Mercer", role: "The Family Doctor", icon: "👨‍⚕️",
        personality: "Composed, charming, practiced liar. Occasionally redirects blame to Mr. Graves.",
        secret: "Is the murderer. Used rare poison from medical contacts. Motive: secret affair with Lady Vivienne, wanted her inheritance.",
        guilty: true,
      },
    ],
    backstory: "Lord Blackwood was found dead in his locked study at midnight. A glass of brandy sat untouched on his desk. The door was locked from inside — yet someone got to him.",
  },
  {
    victim: "Dame Helena Cross",
    setting: "the conservatory",
    weapon: "cyanide laced into her evening tea",
    time: "10pm",
    suspects: [
      {
        id: "gardener", name: "Thomas Briggs", role: "The Head Gardener", icon: "👨‍🌾",
        personality: "Rough, quiet, speaks little. Hides that he discovered Dame Helena's plan to sell the estate.",
        secret: "Discovered Dame Helena was selling the estate — his home of 30 years. Furious but innocent. Was in the greenhouse all evening.",
        guilty: false,
      },
      {
        id: "companion", name: "Miss Elara Voss", role: "The Companion", icon: "👩‍💼",
        personality: "Sweet on the surface, calculating underneath. Very eager to seem helpful.",
        secret: "Was secretly embezzling from Dame Helena's accounts for two years. Feared exposure. Innocent of murder but panicking.",
        guilty: false,
      },
      {
        id: "nephew", name: "Mr. Cecil Cross", role: "The Nephew", icon: "🧔",
        personality: "Charming, well-dressed, laughs too easily. Deflects with humor and anecdotes.",
        secret: "Is the murderer. Poisoned the tea to claim the inheritance before Helena changed her will. Obtained cyanide through a black market chemist contact.",
        guilty: true,
      },
    ],
    backstory: "Dame Helena Cross collapsed at 10pm during her nightly tea ritual in the conservatory. A faint smell of almonds — cyanide. Three people were in the manor that night.",
  },
  {
    victim: "Colonel Ashworth",
    setting: "the billiards room",
    weapon: "a blow to the head disguised as a fall",
    time: "9pm",
    suspects: [
      {
        id: "secretary", name: "Mr. Reginald Holt", role: "The Secretary", icon: "👨‍💼",
        personality: "Precise, formal, visibly anxious. Hides that he had forged documents for the Colonel.",
        secret: "Forged financial documents for Colonel Ashworth for years. Innocent of murder but terrified of exposure.",
        guilty: false,
      },
      {
        id: "wife", name: "Mrs. Constance Ashworth", role: "The Wife", icon: "👩",
        personality: "Cold, composed, almost too calm for a grieving widow. Occasionally lets bitterness slip.",
        secret: "Knew about the Colonel's plan to cut her from the will. Had motive but innocent — she was having dinner with the vicar.",
        guilty: false,
      },
      {
        id: "rival", name: "Sir Edmund Fray", role: "The Business Rival", icon: "🧓",
        personality: "Blunt, confident, dismissive. Acts like he owns every room he enters.",
        secret: "Is the murderer. Killed the Colonel over a stolen business deal worth £200,000. Made the murder look like a drunken fall.",
        guilty: true,
      },
    ],
    backstory: "Colonel Ashworth was found face-down beside the billiards table. Ruled an accident initially — but the angle of the wound tells a different story.",
  },
];

export const DIFFICULTY_SETTINGS = {
  easy: {
    label: "Constable",
    turns: 15,
    clueFrequency: "high",
    description: "More turns, suspects drop clues easily",
    color: "#7ecba0",
  },
  medium: {
    label: "Detective",
    turns: 10,
    clueFrequency: "medium",
    description: "Balanced — the classic experience",
    color: "#c9a84c",
  },
  hard: {
    label: "Scotland Yard",
    turns: 6,
    clueFrequency: "low",
    description: "Few turns, suspects are evasive and deceptive",
    color: "#e07070",
  },
};

export const RANKS = [
  { id: "rookie", label: "Rookie Constable", min: 0, max: 20, icon: "🔰" },
  { id: "detective", label: "Street Detective", min: 21, max: 40, icon: "🕵️" },
  { id: "inspector", label: "Inspector", min: 41, max: 60, icon: "🔍" },
  { id: "chief", label: "Chief Inspector", min: 61, max: 80, icon: "⚖️" },
  { id: "sherlock", label: "Sherlock-Level", min: 81, max: 100, icon: "🎩" },
];

export const ACHIEVEMENTS = [
  { id: "first_solve", label: "First Blood", desc: "Solve your first case", icon: "🩸" },
  { id: "no_wrong", label: "Never Wrong", desc: "Solve without a wrong accusation", icon: "🎯" },
  { id: "speed_demon", label: "Speed Demon", desc: "Solve with 7+ turns remaining", icon: "⚡" },
  { id: "clue_master", label: "Clue Master", desc: "Collect 5 clues in one game", icon: "🔍" },
  { id: "mind_reader", label: "Mind Reader", desc: "Solve on Hard difficulty", icon: "🧠" },
  { id: "wrong_man", label: "Wrong Man", desc: "Accuse an innocent suspect", icon: "😬" },
];

export const QUICK_QUESTIONS = {
  start: [
    "Where were you last night?",
    "Did you like the victim?",
    "What do you know about the death?",
  ],
  follow: [
    "Can you prove that?",
    "You seem nervous...",
    "Who else had a motive?",
    "Tell me about that evening.",
  ],
};
