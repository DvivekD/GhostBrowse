# GhostBrowser — Second Brain & Persistent Memory

## Key Architectural Decisions (Nov 2026)

### 1. Dual-Brain AI Stack
- **Primary Reasoning & Vision**: Gemini 2.5 Flash Thinking (Google AI Studio Free tier: 1,500 RPD, 1M TPM). Chosen over DeepSeek-R1 for primary due to 30x higher free daily quota and shared 1M token context for viewport screenshot analysis.
- **Reasoning Fallback**: DeepSeek-R1 (OpenRouter :free / Groq) for alternative plan generation.
- **Voice STT**: Groq Whisper Large v3 (sub-250ms latency, 2,000 free RPD) with WebGPU local Whisper fallback.
- **Voice TTS**: Kokoro-82M (0.03 RTF open weights) + Web Speech API fallback.

### 2. Autonomous Browser Engine
- **Driver**: `patchright` (stealth fork of Playwright patching CDP `Runtime.enable` leaks) combined with `browser-use`.
- **Concurrency Pattern**: Single Chromium instance hosting isolated `BrowserContext`s governed by an `asyncio.Semaphore(3)`. Reduces RAM from 1.8GB to ~700MB.
- **Hardened Fallback**: Camoufox for C++ engine-level fingerprint spoofing if Cloudflare blocks standard requests.

### 3. Architecture & Integration
- **Backend**: FastAPI async Python sidecar on port 8000.
- **Frontend**: Next.js 15 App Router + React 19 + Tailwind CSS v4 on port 3000.
- **Data Transport**: Server-Sent Events (SSE) for unidirectional real-time streaming of thoughts, status, and 2-5fps base64 WebP thumbnails.
