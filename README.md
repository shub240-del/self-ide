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
It's a static site plus one serverless function (`api/claude.js`). `npx vercel dev` runs both; any static server runs everything except the Claude features.

## Deploying on Vercel with your Claude API key
1. Import this repo in Vercel (no build settings needed: framework "Other", no build command).
2. In **Project → Settings → Environment Variables** add:
   | Name | Value | Required |
   |---|---|---|
   | `ANTHROPIC_API_KEY` | your key from https://platform.claude.com | yes |
   | `APP_PASSCODE` | any secret phrase; the app asks for it once per browser | strongly recommended, or anyone with the URL can spend your API credit |
   | `CLAUDE_MODEL` | default model, e.g. `claude-sonnet-5-5` | optional |
   | `CLAUDE_MODEL_COMPLEX` | model for proof marking & question generation, e.g. `claude-opus-5-5` | optional |
3. Redeploy. The sidebar should show "Claude connected (API key)". If you set a passcode, enter it in **Exam Setup → Rules & settings**.

The key is only read by the server function and is never sent to the browser.

## Storage
On Vercel, progress is saved in the browser (localStorage). Use **Exam Setup → Backup** to export and import between devices. On claude.ai the same app saves to your Claude account instead.
