# ExamForge IDE

A personal exam-preparation platform: syllabus explorer, practice arena, exam simulator, in-browser Python (Pyodide) and JavaScript runners, HTML/CSS/JS labs with functional checks, a mistake notebook, spaced-repetition flashcards and analytics.

Everything about the exams (calendar, patterns, marking, syllabus, question bank, rules) is configurable from **Exam Setup** inside the app.

## Files
- `index.html`: shell and styles
- `data.js`: default configuration (syllabus, exam calendar, practice blueprints, starter question bank, flashcards)
- `engine.js`: storage, Python/JS runners, web-lab checker, grading, spaced repetition, AI hooks
- `app.js`: dashboard, syllabus, practice and exam runner, reports
- `views.js`: tutor, flashcards, mistakes, analytics, exam setup, boot

## Running locally
It's a static site plus one serverless function (`api/ai.js`). `npx vercel dev` runs both; any static server runs everything except the AI features.

## Deploying on Vercel with an AI key
1. Import this repo in Vercel (framework "Other", no build command).
2. In **Project → Settings → Environment Variables** add **one** provider key:
   | Name | Value |
   |---|---|
   | `NVIDIA_API_KEY` | `nvapi-…` key from https://build.nvidia.com/settings/api-keys (used first if set) |
   | `ANTHROPIC_API_KEY` | Claude API key (used if no NVIDIA key, or with `AI_PROVIDER=anthropic`) |

   Optional:
   | Name | Purpose |
   |---|---|
   | `APP_PASSCODE` | strongly recommended for a public site, so strangers can't spend your credit; the app asks for it once per browser |
   | `NVIDIA_MODEL` | default `meta/llama-3.3-70b-instruct`; any model ID from build.nvidia.com |
   | `NVIDIA_MODEL_COMPLEX` | model for proof marking & question generation |
   | `CLAUDE_MODEL` / `CLAUDE_MODEL_COMPLEX` | Claude models (default `claude-sonnet-5-5`) |
   | `AI_PROVIDER` | `nvidia` or `anthropic` to force one when both keys are set |
3. Redeploy. The sidebar shows which provider and model are connected.

Keys are only read by `api/ai.js` on the server and are never sent to the browser.

## Storage
On Vercel, progress is saved in the browser (localStorage). Use **Exam Setup → Backup** to export and import between devices. On claude.ai the same app saves to your Claude account instead.
