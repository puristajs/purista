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
```

The test uses a strict fake model provider and needs no API key.

To run the real service or evaluation, copy `.env.example` to `.env`, set
`OPENAI_API_KEY`, then use `npm start` or `npm run evaluate`.
