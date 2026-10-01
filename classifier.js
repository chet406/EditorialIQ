const SUBJECTS = {
  "Polity": [
    /constitution/i, /parliament/i, /supreme court/i, /high court/i,
    /governance/i, /election/i, /bill/i, /legislation/i, /federal/i
  ],
  "Economy": [
    /economy/i, /rbi/i, /inflation/i, /gdp/i, /fiscal/i,
    /monetary/i, /bank/i, /trade/i, /employment/i, /tax/i
  ],
  "Environment": [
    /climate/i, /environment/i, /biodiversity/i, /pollution/i,
    /forest/i, /wildlife/i, /conservation/i, /emission/i
  ],
  "Internal Security": [
    /security/i, /terror/i, /narcotic/i, /drug/i, /cyber/i,
    /crime/i, /border/i, /insurgency/i, /defence/i
  ],
  "Science & Technology": [
    /artificial intelligence/i, /\bAI\b/i, /technology/i, /space/i,
    /satellite/i, /biotechnology/i, /semiconductor/i, /quantum/i
  ],
  "International Relations": [
    /international/i, /diplomacy/i, /bilateral/i, /summit/i,
    /treaty/i, /foreign policy/i, /united nations/i, /trade/i
  ],
  "Society": [
    /education/i, /health/i, /social/i, /gender/i, /poverty/i,
    /population/i, /urban/i, /rural/i
  ],
  "Agriculture": [
    /agriculture/i, /farmer/i, /crop/i, /irrigation/i, /fertilizer/i,
    /food security/i
  ]
};

function classifyArticle(article) {
  const text = `${article.title} ${article.text}`;

  let bestSubject = "General Current Affairs";
  let bestScore = 0;

  for (const [subject, patterns] of Object.entries(SUBJECTS)) {
    const score = patterns.filter(pattern => pattern.test(text)).length;
    if (score > bestScore) {
      bestScore = score;
      bestSubject = subject;
    }
  }

  const gsPaper =
    ["Polity", "Society"].includes(bestSubject) ? ["GS-II"] :
    ["Economy", "Environment", "Internal Security", "Science & Technology", "Agriculture"].includes(bestSubject) ? ["GS-III"] :
    bestSubject === "International Relations" ? ["GS-II"] :
    ["GS-I"];

  return {
    subject: bestSubject,
    gsPaper,
    relevanceScore: Math.min(98, 55 + bestScore * 9)
  };
}

module.exports = { classifyArticle };
