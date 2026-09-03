# RAG agent tutorial source

This focused source project belongs to the PURISTA tutorial chapter **Build a
retrieval-augmented generation agent**. It assumes that ingestion has already
stored chunks and embeddings behind the injected `KnowledgeRepository`.

The example keeps four boundaries visible:

1. `searchKnowledge` is an authorized PURISTA command.
2. `retrieve_evidence` is a native Harness agent that lets the model choose the
   `search_knowledge` host tool.
3. `answer_knowledge_question` is a native Harness workflow that produces both
   an aggregate answer and real text deltas.
4. `answerKnowledgeQuestion` is a protected PURISTA stream that exposes AI SDK
   UI Message Stream v1 for standard `useChat` clients.
5. `Identity` owns the local login and opaque sessions in PURISTA StateStore.
6. Hono projects the public login command and protected stream, authenticates
   the stream through the internal session command, and serves the static UI.
7. `ui` is a React client built from maintained AI Elements and shadcn source
   components. It consumes the standard stream without a PURISTA browser SDK.

Install the published packages, then run the normal checks:

```bash
npm install
npm run build
npm test
npm run lint
```

The server tests use fake providers and resources, and the UI test runs in
JSDOM. They do not need an API key, a running database, or a browser.

To run the complete application, copy `.env.example` to `.env`, set
`OPENAI_API_KEY`, then use:

```bash
docker compose up -d --wait
npm run build
npm start
```

Open `http://127.0.0.1:3000` and sign in with the credentials shown by the UI.
Stop the server with `Ctrl+C`; use `docker compose down` to stop PostgreSQL.
