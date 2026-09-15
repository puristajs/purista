# Human review workflow tutorial source

This focused project combines a durable Harness tool approval with PURISTA
commands for review creation, reviewer authorization, approval delivery, and
an idempotent business effect. A pending approval is returned as typed data.

```bash
npm install
npm run build
npm test
npm run lint
npm run demo
```

The tests use isolated in-memory adapters and a real `DefaultEventBridge`. The
demo uses a strict fake model and temporary SQLite databases for Harness
checkpoints and Support review records, so it needs no API key. `npm start`
uses `@purista/harness-openai` and reads `OPENAI_API_KEY` from `.env`.
