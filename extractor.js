const cheerio = require("cheerio");

async function extractArticles(url) {
  const timeout = Number(process.env.REQUEST_TIMEOUT_MS || 15000);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "EditorialIQ-College-Project/1.0"
    },
    signal: AbortSignal.timeout(timeout)
  });

  if (!response.ok) {
    throw new Error(`Source returned HTTP ${response.status}.`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  $("script, style, noscript, svg, nav, footer, header").remove();

  const candidates = [];

  $("article").each((index, element) => {
    const el = $(element);
    const title = clean(
      el.find("h1, h2, h3").first().text() ||
      el.attr("aria-label") ||
      ""
    );
    const text = clean(el.text());

    if (title && text.length >= 80) {
      candidates.push({
        id: `article-${index + 1}`,
        title,
        text: text.slice(0, 5000)
      });
    }
  });

  if (candidates.length === 0) {
    $("h1, h2, h3").each((index, element) => {
      const heading = clean($(element).text());
      const parentText = clean($(element).parent().text());

      if (heading && parentText.length >= 80) {
        candidates.push({
          id: `heading-${index + 1}`,
          title: heading,
          text: parentText.slice(0, 5000)
        });
      }
    });
  }

  const unique = [];
  const seen = new Set();

  for (const item of candidates) {
    const key = item.title.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  return unique.slice(0, Number(process.env.MAX_ARTICLES || 25));
}

function clean(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = { extractArticles };
