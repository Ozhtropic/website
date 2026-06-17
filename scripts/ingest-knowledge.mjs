import { createClient } from "@supabase/supabase-js";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
const OPENAI_EMBEDDING_DIMENSIONS = Number(process.env.OPENAI_EMBEDDING_DIMENSIONS || 1536);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  throw new Error("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or OPENAI_API_KEY.");
}

const projectRoot = process.cwd();
const knowledgeDir = path.join(projectRoot, "knowledge");
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\r/g, "")
    .trim();
}

function chunkText(text, chunkSize = 1100) {
  const paragraphs = stripMarkdown(text)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  const chunks = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (!current) {
      current = paragraph;
      continue;
    }

    if (`${current}\n\n${paragraph}`.length <= chunkSize) {
      current = `${current}\n\n${paragraph}`;
      continue;
    }

    chunks.push(current);
    current = paragraph;
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

async function createEmbedding(input) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_EMBEDDING_MODEL,
      input,
      dimensions: OPENAI_EMBEDDING_DIMENSIONS,
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embeddings request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.data?.[0]?.embedding || [];
}

async function loadKnowledgeFiles() {
  const files = await readdir(knowledgeDir);
  return files.filter((file) => file.endsWith(".md"));
}

async function main() {
  const files = await loadKnowledgeFiles();
  let totalChunks = 0;

  for (const file of files) {
    const absolutePath = path.join(knowledgeDir, file);
    const raw = await readFile(absolutePath, "utf8");
    const chunks = chunkText(raw);

    for (let index = 0; index < chunks.length; index += 1) {
      const content = chunks[index];
      const embedding = await createEmbedding(content);

      const { error } = await supabase.from("knowledge_documents").upsert(
        {
          source_path: file,
          chunk_index: index,
          title: file.replace(/\.md$/i, "").replace(/[-_]/g, " "),
          content,
          metadata: {
            source: file,
          },
          embedding,
        },
        {
          onConflict: "source_path,chunk_index",
        }
      );

      if (error) {
        throw error;
      }

      totalChunks += 1;
    }
  }

  console.log(`Ingested ${totalChunks} knowledge chunks from ${files.length} files.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

