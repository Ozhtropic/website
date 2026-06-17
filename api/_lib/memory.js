import { createHash } from "node:crypto";
import { getSupabaseAdmin } from "./supabase-admin.js";
import { createChatCompletion, getMessageText, parseJsonFromText } from "./openai.js";

function normalizeFact(fact) {
  return String(fact || "").trim().replace(/\s+/g, " ");
}

function fingerprintFact(userKey, fact) {
  return createHash("sha256").update(`${userKey}:${fact}`).digest("hex");
}

function dedupeFacts(facts) {
  return [...new Set(facts.map(normalizeFact).filter(Boolean))].slice(0, 6);
}

function extractFactsHeuristically(message) {
  const facts = [];
  const text = String(message || "").trim();

  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (emailMatch) {
    facts.push(`User email is ${emailMatch[0]}.`);
  }

  const phoneMatch = text.match(/(?:\+?\d[\d\s()-]{7,}\d)/);
  if (phoneMatch) {
    facts.push(`User phone number is ${phoneMatch[0].trim()}.`);
  }

  const englishName = text.match(/(?:my name is|i am)\s+([A-Za-z][A-Za-z\s'-]{1,40})/i);
  if (englishName) {
    facts.push(`User name is ${englishName[1].trim()}.`);
  }

  const persianName = text.match(/اسم من\s+([^\n،,.]{2,40})/);
  if (persianName) {
    facts.push(`نام کاربر ${persianName[1].trim()} است.`);
  }

  const companyEn = text.match(/(?:my company is|i work at)\s+([A-Za-z0-9&.,'\-\s]{2,50})/i);
  if (companyEn) {
    facts.push(`User is associated with ${companyEn[1].trim()}.`);
  }

  const companyFa = text.match(/(?:شرکت(?:م)?|کسب.?و.?کار(?:م)?)\s+(?:من\s+)?([^\n،,.]{2,50})/);
  if (companyFa) {
    facts.push(`کاربر با ${companyFa[1].trim()} در ارتباط است.`);
  }

  return facts;
}

export async function listRecentMessages(sessionId, limit = 12) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .in("role", ["user", "assistant"])
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return [...(data || [])].reverse();
}

export async function storeMessage({ sessionId, userKey, channel, role, content, language, metadata = {} }) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("chat_messages").insert({
    session_id: sessionId,
    user_key: userKey,
    channel,
    role,
    content,
    language,
    metadata,
  });

  if (error) {
    throw error;
  }
}

export async function listLongTermMemory(userKey, limit = 8) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("chat_memory_facts")
    .select("fact, weight, updated_at")
    .eq("user_key", userKey)
    .order("weight", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data || [];
}

export async function storeMemoryFacts({ sessionId, userKey, language, source, facts }) {
  const normalizedFacts = dedupeFacts(facts);
  if (!normalizedFacts.length) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  const rows = normalizedFacts.map((fact) => ({
    session_id: sessionId,
    user_key: userKey,
    language,
    source,
    fact,
    fingerprint: fingerprintFact(userKey, fact),
  }));

  const { error } = await supabase
    .from("chat_memory_facts")
    .upsert(rows, { onConflict: "fingerprint" });

  if (error) {
    throw error;
  }

  return normalizedFacts;
}

export async function extractMemoryFacts({ message, language }) {
  const heuristicFacts = extractFactsHeuristically(message);

  if (!String(message || "").trim()) {
    return heuristicFacts;
  }

  try {
    const { message: result } = await createChatCompletion({
      messages: [
        {
          role: "system",
          content:
            language === "fa"
              ? "از پیام کاربر فقط حقایق بادوام و مفید برای حافظه بلندمدت را استخراج کن. فقط JSON برگردان با ساختار {\"facts\":[\"...\"]} و حداکثر 4 فکت."
              : "Extract only durable, useful long-term memory facts from the user's message. Return JSON only with the shape {\"facts\":[\"...\"]} and at most 4 facts.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0,
      maxTokens: 180,
    });

    const parsed = parseJsonFromText(getMessageText(result), { facts: [] });
    return dedupeFacts([...(parsed.facts || []), ...heuristicFacts]);
  } catch (_error) {
    return dedupeFacts(heuristicFacts);
  }
}
