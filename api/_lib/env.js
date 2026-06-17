export const env = {
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  aiBaseUrl: (process.env.AI_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(
    /\/+$/,
    ""
  ),
  aiApiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY || "",
  aiChatModel: process.env.AI_CHAT_MODEL || process.env.OPENAI_CHAT_MODEL || "gpt-5.2",
  aiEmbeddingModel:
    process.env.AI_EMBEDDING_MODEL || process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
  aiEmbeddingDimensions: Number(process.env.AI_EMBEDDING_DIMENSIONS || process.env.OPENAI_EMBEDDING_DIMENSIONS || 1536),
  aiSendEmbeddingDimensions:
    (process.env.AI_SEND_EMBEDDING_DIMENSIONS || process.env.OPENAI_SEND_EMBEDDING_DIMENSIONS || "").toLowerCase() ===
    "true",
  aiHttpReferer: process.env.AI_HTTP_REFERER || process.env.OPENROUTER_HTTP_REFERER || "",
  aiAppTitle: process.env.AI_APP_TITLE || process.env.OPENROUTER_APP_TITLE || "Ozthropic",
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
  telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET || "",
};

export function getMissingServerEnv() {
  const missing = [];

  if (!env.supabaseUrl) missing.push("SUPABASE_URL");
  if (!env.supabaseServiceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!env.aiApiKey) missing.push("AI_API_KEY");

  return missing;
}
