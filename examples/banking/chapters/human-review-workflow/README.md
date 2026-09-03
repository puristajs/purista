# Human review workflow tutorial source

This focused project combines a durable Harness external wait with PURISTA
commands for review creation, reviewer authorization, terminal signaling, and
an idempotent business effect. A waiting review is a typed result, not an error.

```bash
npm install
npm run build
npm test
npm run lint
npm run demo
```

The tests use isolated in-memory adapters and a real `DefaultEventBridge`. The
demo uses temporary SQLite databases for Harness checkpoints and Support
review records. No model provider or API key is involved.
