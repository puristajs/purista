# Apply AI guardrails to the support classifier

This complete PURISTA checkpoint adds input and output content controls to the
native Harness classifier mounted by the `Support` service. A normal PURISTA
command invokes the guarded target through EventBridge.

- The input rail blocks a small, deterministic instruction-override pattern
  before the model provider runs.
- The output rail removes long card-like digit sequences from the structured
  reason before the caller receives it.

Run `npm install`, `npm run build`, `npm run lint`, and `npm test` after
the Harness v3 packages are published. Tests use `FakeModelProvider` and make
no network request. To start the service with a real provider, copy
`.env.example` to `.env`, set `OPENAI_API_KEY`, and run `npm start`.
