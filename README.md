# AetherOS — AI Network Intelligence on Stacks

Elite AI-powered professional network strategist, fully secured on the Stacks blockchain.

---

## Tech Stack

- **Frontend:** Next.js 15, React 18, Tailwind CSS, Framer Motion
- **AI:** Groq API — `llama-3.3-70b-versatile` (primary) with automatic fallback to `llama3-70b-8192` → `llama3-8b-8192`
- **Wallet:** Stacks Connect (`@stacks/connect`) — Leather, Xverse, and other Stacks-compatible wallets
- **Deployment:** Vercel

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo>
cd aetheros-landing
npm install
```

### 2. Set Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Groq API key:

```
GROQ_API_KEY=your_groq_api_key_here
```

Get a free Groq API key at: https://console.groq.com

### 3. Run Dev Server

```bash
npm run dev
```

---

## Deploying to Vercel

### Required Environment Variables

Add this in your Vercel project dashboard under **Settings → Environment Variables**:

| Variable | Value | Notes |
|---|---|---|
| `GROQ_API_KEY` | `gsk_...` | From console.groq.com |

**Stacks wallet does NOT require any server-side environment variable** — it runs entirely client-side.

### Deploy Steps

1. Push to GitLab/GitHub
2. Import project on vercel.com
3. Add `GROQ_API_KEY` in Environment Variables
4. Deploy ✅

---

## AI Model Fallback Chain

The strategy route automatically tries models in order if one fails:

1. `llama-3.3-70b-versatile` — Most capable, used by default
2. `llama3-70b-8192` — Stable fallback
3. `llama3-8b-8192` — Lightweight last resort

If **no API key** is set, the app runs in demo mode with a pre-built sample strategy.

---

## Stacks Wallet Integration

Supports all major Stacks-compatible wallets:
- **Leather** (formerly Hiro Wallet) — https://leather.io
- **Xverse** — https://xverse.app

Users connect via `@stacks/connect`. No server secret needed.

---

## Project Structure

```
app/
  api/strategy/route.ts   ← Groq AI endpoint with fallback
  layout.tsx              ← Root layout + StacksProvider
  page.tsx                ← Landing page
  globals.css

src/components/
  providers/
    StacksProvider.tsx    ← Stacks wallet context
  Navbar.tsx              ← Connect Wallet button
  Hero.tsx
  Features.tsx
  HowItWorks.tsx
  AppSection.tsx          ← AI strategy form + output
  Token.tsx
  About.tsx
  CtaSection.tsx
  Footer.tsx
```
