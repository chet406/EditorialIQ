const express = require("express");
const { extractArticles } = require("../services/extractor");
const { filterArticles } = require("../services/relevanceFilter");
const { classifyArticle } = require("../services/classifier");
const { buildStudyModule } = require("../services/aiProcessor");

const router = express.Router();

router.post("/process", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !/^https?:\/\//i.test(url)) {
      return res.status(400).json({
        error: "Please provide a valid http/https newspaper or news-source URL."
      });
    }

    const extracted = await extractArticles(url);
    const filtered = filterArticles(extracted);

    const processed = filtered.map(article => {
      const classification = classifyArticle(article);
      return buildStudyModule({
        ...article,
        ...classification,
        sourceUrl: url
      });
    });

    res.json({
      sourceUrl: url,
      fetchedAt: new Date().toISOString(),
      totalExtracted: extracted.length,
      totalRelevant: processed.length,
      articles: processed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || "Unable to process the source."
    });
  }
});

module.exports = router;
