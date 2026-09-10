# Complete RAG tutorial source

This focused source project belongs to the PURISTA tutorial chapter **Build a
complete RAG pipeline**. It contains the indexing and answer paths in one
runnable application.

The example keeps these boundaries visible:

1. `runIngestKnowledge` is an authorized PURISTA command that invokes the
   mounted `ingestKnowledge` workflow through the EventBridge.
2. `ingestKnowledge` chunks source text, obtains vectors from the named Harness
   embedding model, and stores them through the `storeKnowledgeChunks` host
   tool and injected `KnowledgeRepository`.
3. `retrieveKnowledge` owns query embedding and calls the private
   `queryKnowledgeRepository` host tool, which scopes every database query with
   the authenticated tenant.
4. `answerKnowledgeQuestion` is a configurable Harness agent. The model can
   choose its `searchKnowledge` host tool, which authorizes the requested
   collection and invokes `retrieveKnowledge` through the EventBridge.
5. `runAnswerKnowledgeQuestion` provides the protected aggregate endpoint, and
   `streamAnswerKnowledgeQuestion` provides the protected AI SDK UI Message
   Stream v1 endpoint over the same agent contract. Tool approvals are returned
   as resumable outcomes instead of server errors.
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

To run the complete application with deterministic model responses, copy
`.env.example` to `.env`, then use:

```bash
docker compose up -d --wait
npm run build
npm run demo
```

Open `http://127.0.0.1:3000` and sign in with the credentials shown by the UI.
Stop the server with `Ctrl+C`; use `docker compose down` to stop PostgreSQL.
The scripted entry point resets only its `transfer-guide` fixture when it
starts, so the same walkthrough can be repeated without deleting the volume.

To use a live OpenAI model, set `OPENAI_API_KEY` in `.env` and run `npm start`
instead. Both modes use the same PURISTA services, Harness definitions,
PostgreSQL repository, Hono endpoints, and React UI.
