/*
  EditorialIQ study-module processor.

  This starter intentionally works without an external AI key.
  It creates a deterministic educational structure from the source text.

  Later, a permitted AI provider can replace/extend this function while
  preserving the same returned JSON shape.
*/

function buildStudyModule(article) {
  const text = article.text || "";
  const sentences = splitSentences(text);

  const summary = sentences.slice(0, 3).join(" ");

  const terms = findTerms(text, [
    "government", "policy", "scheme", "constitution", "parliament",
    "climate", "environment", "inflation", "RBI", "cybersecurity",
    "artificial intelligence", "biodiversity", "security", "trade",
    "agriculture", "technology"
  ]);

  return {
    ...article,

    whyInNews: [
      "The topic contains a current policy, governance, economic, social, environmental, security or international-affairs development.",
      `EditorialIQ classified it under ${article.subject}.`,
      "The topic can be connected with the UPSC/MPSC syllabus and current affairs preparation."
    ],

    whatHappened: summary || "The source contains a current-affairs development requiring further reading.",

    simpleExplanation:
      "In simple terms, this article should be understood by identifying the development, its background, the institutions involved, its wider impact and the policy challenges associated with it.",

    background: [
      "Identify the underlying issue and its historical or policy context.",
      "Identify the major institutions, laws, schemes or international frameworks involved.",
      "Connect the development with the relevant UPSC/MPSC syllabus area."
    ],

    keyTerms: terms.length ? terms : ["Current Affairs", article.subject],

    institutions: extractInstitutions(text),

    lawsPolicies: [
      "Check the original source and official government documents for the exact law, rule, scheme or policy mentioned.",
      "Do not treat a newspaper summary as a substitute for the primary legal or policy document."
    ],

    importantData: extractNumbers(text),

    causes: [
      "Identify the immediate trigger mentioned in the source.",
      "Separate structural causes from short-term developments.",
      "Verify important statistics using primary sources before using them in an examination answer."
    ],

    impacts: [
      "Assess administrative and governance implications.",
      "Assess economic, social, environmental or security implications as applicable.",
      "Identify groups or institutions most affected."
    ],

    challenges: [
      "Implementation gaps",
      "Institutional coordination",
      "Availability and quality of data",
      "Ground-level capacity and enforcement"
    ],

    wayForward: [
      "Strengthen institutional coordination.",
      "Use evidence-based policy and reliable data.",
      "Improve implementation and monitoring.",
      "Balance short-term action with long-term structural reform."
    ],

    prelims: [
      `Subject: ${article.subject}`,
      `GS mapping: ${article.gsPaper.join(", ")}`,
      ...terms.slice(0, 5)
    ],

    mains: [
      `Explain the significance of the development in the context of ${article.subject}.`,
      "Discuss the major challenges and suggest a suitable way forward.",
      "Examine the role of institutions and policy implementation."
    ],

    examMapping: {
      prelims: `Useful for ${article.subject} concepts and factual current affairs.`,
      mains: `Relevant to ${article.gsPaper.join(", ")} depending on the exact issue.`,
      essay: "Can be used where the topic connects with governance, development, society, technology, environment or India's global role."
    },

    questions: makeQuestions(article)
  };
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function findTerms(text, dictionary) {
  return dictionary.filter(term =>
    new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(text)
  );
}

function extractInstitutions(text) {
  const known = [
    "Supreme Court",
    "Parliament",
    "RBI",
    "United Nations",
    "Government",
    "State Government",
    "Police",
    "Ministry"
  ];

  return known.filter(name => new RegExp(name, "i").test(text));
}

function extractNumbers(text) {
  const matches = text.match(/\b\d[\d,.]*\s?(?:%|million|billion|crore|lakh|km|years?)?\b/gi) || [];
  return [...new Set(matches)].slice(0, 10);
}

function makeQuestions(article) {
  return [
    {
      question: `The article is primarily classified under which EditorialIQ subject?`,
      options: [article.subject, "Unrelated entertainment", "Sports only", "Advertising"],
      answer: 0,
      explanation: `EditorialIQ's classification engine identified the topic as ${article.subject}.`
    },
    {
      question: "Which approach is most useful for UPSC current-affairs preparation?",
      options: [
        "Memorise the headline only",
        "Connect the development with concepts, institutions and the syllabus",
        "Ignore the background",
        "Read only social-media comments"
      ],
      answer: 1,
      explanation: "UPSC preparation benefits from connecting current developments with static concepts and syllabus areas."
    },
    {
      question: "What should be done before quoting an important statistic in a Mains answer?",
      options: [
        "Use any number found online",
        "Verify it using a reliable primary or authoritative source",
        "Avoid checking it",
        "Change the number to make it memorable"
      ],
      answer: 1,
      explanation: "Important statistics should be checked against reliable sources."
    }
  ];
}

module.exports = { buildStudyModule };
