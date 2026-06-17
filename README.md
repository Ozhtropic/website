# Ozthropic Cinematic Scroll Website

One-page Vite + React site for Ozthropic, built around a scroll-controlled cinematic hero video and Ozthropic's neutral brand system.

It now also includes a bilingual chatbot stack with:

- A central server-side brain in `api/_lib`
- A full-page chat experience at `/chat`
- An embeddable widget script at `/ozthropic-chat-widget.js`
- A Telegram bot webhook at `/api/telegram-webhook`
- Supabase + pgvector RAG, short-term memory, long-term memory, lead capture, and registration-status lookup

## Run Locally

```bash
npm install
npm run dev
```

## Connect Supabase

Copy the example environment file, then add your Supabase Project URL and anon public key:

```bash
cp .env.example .env.local
```

```txt
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Use the anon public key only. Never put a Supabase service role key in this frontend project.

For Vercel, add the same two variables under Project Settings > Environment Variables, then redeploy.

For the chatbot server, also add:

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
OPENAI_CHAT_MODEL
OPENAI_EMBEDDING_MODEL
OPENAI_EMBEDDING_DIMENSIONS
TELEGRAM_BOT_TOKEN
TELEGRAM_WEBHOOK_SECRET
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Do not expose it in frontend code.

## Create The Supabase Schema

Run:

```sql
supabase/schema.sql
```

This creates the RAG documents table, memory tables, leads table, and registration status table.

## Ingest Knowledge

Put knowledge files in:

```txt
knowledge/
```

Then ingest them:

```bash
npm run ingest:knowledge
```

The script chunks each markdown file, creates embeddings, and upserts them into `knowledge_documents`.

## Chat Endpoints

- Website + widget chat API: `/api/chat`
- Telegram webhook: `/api/telegram-webhook`
- Full chat page: `/chat`
- Widget script: `/ozthropic-chat-widget.js`

Example widget install:

```html
<script
  src="https://ozthropic.com/ozthropic-chat-widget.js"
  data-language="en"
  data-position="right"
  defer
></script>
```

To register the Telegram webhook after deploy, point Telegram to:

```txt
https://your-domain.com/api/telegram-webhook
```

## Add The Hero Video

Place the final cinematic video at:

```txt
public/media/hero.mp4
```

The page includes a branded fallback until that file is available.

## Build

```bash
npm run build
```
