import fetch from "node-fetch";

// OpenAI call
export async function askOpenAI(question, apiKey) {
  if (!apiKey) return `OpenAI API key missing. Placeholder answer: "${question}"`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: question }
      ],
      temperature: 0
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response from OpenAI";
}

// Grok call
export async function askGrok(question, apiKey, apiUrl) {
  if (!apiKey || !apiUrl) return `Grok API key missing. Placeholder answer: "${question}"`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "grok-4-latest",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: question }
      ],
      temperature: 0,
      stream: false
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response from Grok";
}
