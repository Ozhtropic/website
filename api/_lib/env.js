export const env = {
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiChatModel: process.env.OPENAI_CHAT_MODEL || "gpt-5.2",
  openaiEmbeddingModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
  openaiEmbeddingDimensions: Number(process.env.OPENAI_EMBEDDING_DIMENSIONS || 1536),
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
  telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET || "",
};

export function getMissingServerEnv() {
  const missing = [];

  if (!env.supabaseUrl) missing.push("SUPABASE_URL");
  if (!env.supabaseServiceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!env.openaiApiKey) missing.push("OPENAI_API_KEY");

  return missing;
}

