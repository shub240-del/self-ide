# ExamForge IDE

A personal exam-preparation platform: syllabus explorer, practice arena, exam simulator, in-browser Python (Pyodide) and JavaScript runners, HTML/CSS/JS labs with functional checks, a mistake notebook, spaced-repetition flashcards and analytics.

Everything about the exams (calendar, patterns, marking, syllabus, question bank, rules) is configurable from **Exam Setup** inside the app.

## Files
- `index.html`: shell and styles
- `data.js`: default configuration (syllabus, exam calendar, practice blueprints, starter question bank, flashcards)
- `engine.js`: storage, Python/JS runners, web-lab checker, grading, spaced repetition, AI hooks
- `app.js`: dashboard, syllabus, practice and exam runner, reports
- `views.js`: tutor, flashcards, mistakes, analytics, exam setup, boot

## Running
It is a static site with no build step. Serve the folder (e.g. `npx serve .`) or deploy to Vercel as-is.

Outside claude.ai, progress is saved in the browser's localStorage (use Exam Setup → Backup to export), and the Claude-powered features (tutor, AI marking, question generation) are unavailable; subjective answers fall back to rubric self-marking.
