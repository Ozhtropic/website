import { getMissingServerEnv } from "./_lib/env.js";
import { runChatBrain } from "./_lib/brain.js";
import { readJsonBody, sendJson, setCorsHeaders } from "./_lib/http.js";

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "GET") {
    sendJson(res, 200, {
      ok: true,
      configured: getMissingServerEnv().length === 0,
    });
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  const missingEnv = getMissingServerEnv();
  if (missingEnv.length) {
    sendJson(res, 503, {
      ok: false,
      error: "Chatbot server is not fully configured.",
      missingEnv,
    });
    return;
  }

  try {
    const body = await readJsonBody(req);

    if (!body.message || typeof body.message !== "string") {
      sendJson(res, 400, { ok: false, error: "A text message is required." });
      return;
    }

    const result = await runChatBrain({
      sessionId: body.sessionId,
      userKey: body.userKey,
      channel: body.channel || "web",
      language: body.language || "en",
      message: body.message,
      metadata: {
        origin: req.headers.origin || null,
        userAgent: req.headers["user-agent"] || null,
      },
    });

    sendJson(res, 200, result);
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : "Unexpected server error.",
    });
  }
}

