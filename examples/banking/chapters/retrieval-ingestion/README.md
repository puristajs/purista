# Complete RAG tutorial source

This focused source project belongs to the PURISTA tutorial chapter **Build a
complete RAG pipeline**. It contains the indexing and answer paths in one
runnable application.

The example keeps these boundaries visible:

1. `ingestKnowledge` is an authorized PURISTA command that chunks source text,
   obtains vectors from the mounted Harness embedding model, and stores them
   through the injected `KnowledgeRepository`.
2. `searchKnowledge` uses the same Harness embedding model and performs
   tenant-scoped retrieval through the repository resource.
3. `retrieve_evidence` is a native Harness agent that lets the model choose the
   `search_knowledge` host tool.
4. `answer_knowledge_question` is a native Harness workflow that produces both
   an aggregate answer and real text deltas.
5. `answerKnowledgeQuestion` is a protected PURISTA stream that exposes AI SDK
   UI Message Stream v1 for standard `useChat` clients.
6. `Identity` owns the local login and opaque sessions in PURISTA StateStore.
7. Hono projects the public login command, protected ingestion command, and
   protected stream, authenticates
   the stream through the internal session command, and serves the static UI.
8. `ui` lets the learner ingest the sample source before chatting. It uses
   maintained AI Elements and shadcn source components and consumes the
   standard stream without a PURISTA browser SDK.

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
