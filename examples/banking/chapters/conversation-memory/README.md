# Conversation history tutorial source

This focused project teaches how Harness conversation history works when an
agent is mounted on a PURISTA service. It deliberately separates three stores:

- Harness storage owns sessions, transcripts, run receipts, and durable waits.
- Harness memory stores application facts that agents read or write explicitly.
- PURISTA StateStore remains for operational application state such as login
  sessions; it is not the transcript database.

Run the deterministic checks without credentials:

```bash
npm install
npm run build
npm test
npm run lint
```

To run the Support service with SQLite-backed conversation history, copy
`.env.example` to `.env`, set `OPENAI_API_KEY`, and run `npm start`.
