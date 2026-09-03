# Human review workflow tutorial source

This focused project combines a durable Harness external wait with PURISTA
commands for review creation, reviewer authorization, terminal signaling, and
an idempotent business effect. A waiting review is a typed result, not an error.

```bash
npm install
npm run build
npm test
npm run lint
```

The integration tests use in-memory adapters and a real `DefaultEventBridge`.
No model provider is involved.
