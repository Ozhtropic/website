import { env } from "./env.js";

function stripCodeFence(text) {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

export function getMessageText(message) {
  if (!message) return "";

  if (typeof message.content === "string") {
    return message.content.trim();
  }

  if (Array.isArray(message.content)) {
    return message.content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.type === "text" && typeof item.text === "string") return item.text;
        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
}

export function parseJsonFromText(text, fallback = {}) {
  try {
    return JSON.parse(stripCodeFence(text));
  } catch (_error) {
    return fallback;
  }
}

export async function createChatCompletion({
  messages,
  tools = [],
  temperature = 0.2,
  maxTokens = 700,
}) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: env.openaiChatModel,
      messages,
      tools: tools.length ? tools : undefined,
      tool_choice: tools.length ? "auto" : undefined,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI chat request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return {
    message: data.choices?.[0]?.message || null,
    usage: data.usage || null,
  };
}

export async function createEmbedding(input) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: env.openaiEmbeddingModel,
      input,
      dimensions: env.openaiEmbeddingDimensions,
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI embeddings request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.data?.[0]?.embedding || [];
}

