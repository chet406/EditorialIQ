require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const newsRoutes = require("./routes/news");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    name: "EditorialIQ",
    mode: "realtime-starter"
  });
});

app.use("/api/news", newsRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`EditorialIQ running at http://localhost:${PORT}`);
});
