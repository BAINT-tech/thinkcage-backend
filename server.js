import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { askOpenAI, askGrok } from "./utils/aiClients.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Simple in-memory history
const userHistory = {};

// POST /api/ask
app.post("/api/ask", async (req, res) => {
  const { userId, question, provider } = req.body;
  if (!userId || !question || !provider) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    let answer;
    if (provider === "openai") {
      answer = await askOpenAI(question, process.env.OPENAI_API_KEY);
    } else if (provider === "grok") {
      answer = await askGrok(question, process.env.GROK_API_KEY, process.env.GROK_API_URL);
    } else {
      answer = "Invalid provider. Use 'openai' or 'grok'.";
    }

    if (!userHistory[userId]) userHistory[userId] = [];
    userHistory[userId].push({ question, answer, provider });

    res.json({ answer, history: userHistory[userId] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/", (req, res) => {
  res.send("ThinkCage backend is live!");
});

app.listen(PORT, () => console.log(`ThinkCage backend running on port ${PORT}`));
