import { env, getMissingServerEnv } from "./_lib/env.js";
import { runChatBrain } from "./_lib/brain.js";
import { readJsonBody, sendJson } from "./_lib/http.js";

function detectLanguageFromText(text) {
  return /[\u0600-\u06FF]/.test(String(text || "")) ? "fa" : "en";
}

async function sendTelegramMessage(chatId, text) {
  const response = await fetch(`https://api.telegram.org/bot${env.telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram sendMessage failed: ${response.status} ${errorText}`);
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    sendJson(res, 200, {
      ok: true,
      endpoint: "telegram-webhook",
      configured: getMissingServerEnv().length === 0 && Boolean(env.telegramBotToken),
    });
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  if (env.telegramWebhookSecret) {
    const receivedSecret = req.headers["x-telegram-bot-api-secret-token"];
    if (receivedSecret !== env.telegramWebhookSecret) {
      sendJson(res, 401, { ok: false, error: "Invalid Telegram webhook secret." });
      return;
    }
  }

  const missingEnv = getMissingServerEnv();
  if (missingEnv.length || !env.telegramBotToken) {
    sendJson(res, 503, {
      ok: false,
      error: "Telegram chatbot is not fully configured.",
      missingEnv: env.telegramBotToken ? missingEnv : [...missingEnv, "TELEGRAM_BOT_TOKEN"],
    });
    return;
  }

  try {
    const update = await readJsonBody(req);
    const message = update.message || update.edited_message;
    const text = message?.text;

    if (!message?.chat?.id || !text) {
      sendJson(res, 200, { ok: true, ignored: true });
      return;
    }

    const sessionId = `telegram:${message.chat.id}`;
    const userKey = `telegram-user:${message.from?.id || message.chat.id}`;
    const language = detectLanguageFromText(text);

    const result = await runChatBrain({
      sessionId,
      userKey,
      channel: "telegram",
      language,
      message: text,
      metadata: {
        telegramChatId: message.chat.id,
        telegramUsername: message.from?.username || null,
      },
    });

    await sendTelegramMessage(message.chat.id, result.reply);
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : "Unexpected Telegram server error.",
    });
  }
}

