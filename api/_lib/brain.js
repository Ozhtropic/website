import { randomUUID } from "node:crypto";
import { createChatCompletion, createEmbedding, getMessageText } from "./openai.js";
import {
  extractMemoryFacts,
  listLongTermMemory,
  listRecentMessages,
  storeMemoryFacts,
  storeMessage,
} from "./memory.js";
import { chatTools, executeToolCall } from "./tools.js";
import { getSupabaseAdmin } from "./supabase-admin.js";

function detectLanguage(message, fallback = "en") {
  const text = String(message || "");
  return /[\u0600-\u06FF]/.test(text) ? "fa" : fallback;
}

function createSessionId() {
  return randomUUID();
}

function buildSystemPrompt({ language, longTermMemory, knowledge, channel }) {
  const memoryBlock = longTermMemory.length
    ? longTermMemory.map((item, index) => `${index + 1}. ${item.fact}`).join("\n")
    : language === "fa"
    ? "حافظه‌ی بلندمدت خاصی هنوز ثبت نشده است."
    : "No long-term memory facts are stored yet.";

  const knowledgeBlock = knowledge.length
    ? knowledge
        .map(
          (item, index) =>
            `${index + 1}. [${item.title || item.source_path || "knowledge"}] ${item.content}`
        )
        .join("\n\n")
    : language === "fa"
    ? "مدرک RAG بازیابی نشد."
    : "No RAG knowledge excerpts were retrieved.";

  return `
You are Ozthropic's bilingual AI assistant for English and Persian.
The current channel is: ${channel}.
Always reply in ${language === "fa" ? "Persian unless the user clearly switches to English." : "English unless the user clearly switches to Persian."}

Style:
- Warm, practical, concise.
- Focus on Australian business support, automation, lead handling, and onboarding guidance.
- If you do not know something from the retrieved knowledge or tools, say so plainly.

Tool rules:
- Use capture_lead when the user wants follow-up, a proposal, a consultation, or direct contact.
- Before capture_lead, make sure you have the user's full name and at least one contact detail: email or phone.
- Use check_registration_status only when the user explicitly asks for enrolment, application, or registration status.
- Never invent a registration result.

Memory:
${memoryBlock}

Retrieved knowledge:
${knowledgeBlock}
`.trim();
}

async function retrieveKnowledge(message, limit = 6) {
  const supabase = getSupabaseAdmin();
  const embedding = await createEmbedding(message);

  const { data, error } = await supabase.rpc("match_knowledge_documents", {
    query_embedding: embedding,
    match_count: limit,
  });

  if (error) {
    throw error;
  }

  return data || [];
}

function toToolSummary(toolEvents) {
  return toolEvents.map((event) => ({
    tool: event.name,
    ok: event.result?.ok ?? false,
    status: event.result?.status || null,
  }));
}

export async function runChatBrain(input) {
  const sessionId = input.sessionId || createSessionId();
  const language = detectLanguage(input.message, input.language || "en");
  const userKey = input.userKey || sessionId;
  const channel = input.channel || "web";
  const metadata = input.metadata || {};

  const [recentMessages, longTermMemory, knowledge] = await Promise.all([
    listRecentMessages(sessionId).catch(() => []),
    listLongTermMemory(userKey).catch(() => []),
    retrieveKnowledge(input.message).catch(() => []),
  ]);

  await storeMessage({
    sessionId,
    userKey,
    channel,
    role: "user",
    content: input.message,
    language,
    metadata,
  });

  const messages = [
    {
      role: "system",
      content: buildSystemPrompt({ language, longTermMemory, knowledge, channel }),
    },
    ...recentMessages.map((item) => ({
      role: item.role,
      content: item.content,
    })),
    {
      role: "user",
      content: input.message,
    },
  ];

  const firstPass = await createChatCompletion({
    messages,
    tools: chatTools,
    temperature: 0.25,
    maxTokens: 800,
  });

  const toolEvents = [];
  let assistantText = getMessageText(firstPass.message);

  if (firstPass.message?.tool_calls?.length) {
    messages.push({
      role: "assistant",
      content: assistantText || "",
      tool_calls: firstPass.message.tool_calls,
    });

    for (const toolCall of firstPass.message.tool_calls) {
      const result = await executeToolCall(toolCall, {
        sessionId,
        userKey,
        channel,
        language,
        metadata,
      });

      toolEvents.push({
        id: toolCall.id,
        name: toolCall.function.name,
        result,
      });

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }

    const secondPass = await createChatCompletion({
      messages,
      tools: chatTools,
      temperature: 0.2,
      maxTokens: 700,
    });

    assistantText = getMessageText(secondPass.message);
  }

  if (!assistantText) {
    assistantText =
      language === "fa"
        ? "الان پاسخ نهایی آماده نشد. لطفاً یک بار دیگر پیام‌تان را بفرستید."
        : "I could not produce a final reply just now. Please send your message again.";
  }

  await storeMessage({
    sessionId,
    userKey,
    channel,
    role: "assistant",
    content: assistantText,
    language,
    metadata: {
      ...metadata,
      tool_summary: toToolSummary(toolEvents),
    },
  });

  const extractedFacts = await extractMemoryFacts({
    message: input.message,
    language,
  });

  const toolFacts = toolEvents
    .filter((event) => event.name === "capture_lead" && event.result?.ok)
    .flatMap((event) => {
      const lead = event.result.lead || {};
      return [
        lead.full_name ? `User full name is ${lead.full_name}.` : "",
        lead.email ? `User email is ${lead.email}.` : "",
        lead.phone ? `User phone is ${lead.phone}.` : "",
        lead.company ? `User company is ${lead.company}.` : "",
        lead.interest ? `User is interested in ${lead.interest}.` : "",
      ];
    })
    .filter(Boolean);

  await storeMemoryFacts({
    sessionId,
    userKey,
    language,
    source: channel,
    facts: [...extractedFacts, ...toolFacts],
  }).catch(() => []);

  return {
    ok: true,
    sessionId,
    language,
    reply: assistantText,
    toolEvents: toToolSummary(toolEvents),
    sources: knowledge.map((item) => ({
      title: item.title || item.source_path || "knowledge",
      sourcePath: item.source_path || null,
      similarity: item.similarity || null,
    })),
  };
}
