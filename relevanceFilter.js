const LOW_VALUE_PATTERNS = [
  /birthday/i,
  /happy birthday/i,
  /advertisement/i,
  /\badvertorial\b/i,
  /sponsored/i,
  /promotion/i,
  /promotional/i,
  /horoscope/i,
  /recipe/i,
  /movie review/i,
  /film review/i,
  /celebrity/i,
  /fashion/i,
  /lifestyle/i,
  /astrology/i,
  /obituary/i
];

const UPSC_PATTERNS = [
  /government/i,
  /policy/i,
  /scheme/i,
  /supreme court/i,
  /high court/i,
  /parliament/i,
  /constitution/i,
  /bill/i,
  /act\b/i,
  /rbi/i,
  /inflation/i,
  /gdp/i,
  /economy/i,
  /climate/i,
  /environment/i,
  /biodiversity/i,
  /pollution/i,
  /cyber/i,
  /security/i,
  /defence/i,
  /space/i,
  /technology/i,
  /artificial intelligence/i,
  /international/i,
  /diplomacy/i,
  /trade/i,
  /election/i,
  /governance/i,
  /health/i,
  /education/i,
  /agriculture/i,
  /disaster/i,
  /infrastructure/i
];

function filterArticles(articles) {
  return articles.filter(article => {
    const content = `${article.title} ${article.text}`;

    const looksLowValue = LOW_VALUE_PATTERNS.some(pattern =>
      pattern.test(content)
    );

    const upscSignals = UPSC_PATTERNS.filter(pattern =>
      pattern.test(content)
    ).length;

    return !looksLowValue && upscSignals >= 1;
  });
}

module.exports = { filterArticles };
