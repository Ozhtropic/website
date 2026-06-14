# Ozthropic Cinematic Scroll Website

One-page Vite + React site for Ozthropic, built around a scroll-controlled cinematic hero video and Ozthropic's neutral brand system.

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
