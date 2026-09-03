# Agent evaluation tutorial source

This complete PURISTA checkpoint mounts one portable Harness classification
agent on the `Support` service. The evaluation runner executes that exact
definition over a versioned dataset, scores it with deterministic adapters,
and applies a release gate.

```bash
npm install
npm run build
npm test
npm run lint
npm run evaluate
npm run demo
```

The tests, default evaluation command, and EventBridge demo use strict fake
model providers and need no API key. They prove the evaluation pipeline and
release-gate wiring; they do not measure a live model's quality.

To run the live service or evaluate a real provider candidate, copy
`.env.example` to `.env`, set `OPENAI_API_KEY`, then use `npm start` or
`npm run evaluate:live`.
