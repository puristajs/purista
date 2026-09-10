# Build a RAG feature with PURISTA

This example is the runnable source for the PURISTA retrieval and ingestion tutorial. It uses a small Example Bank help document so the framework boundaries stay visible.

The `Knowledge` service owns the contracts, resources, guards, commands, streams, and one `knowledgeHarness` definition. PostgreSQL with pgvector stores document chunks and embeddings. The PURISTA StateStore belongs to `Identity` and stores only short lived login sessions.

The application has two paths:

1. `runIngestKnowledge` checks collection access, invokes the service owned `ingestKnowledge` workflow, embeds the chunks, and stores them through the `storeKnowledgeChunks` host tool.
2. `searchKnowledge` is a model selected host tool. It checks collection access and invokes `retrieveKnowledge`, which embeds the query and calls the private `queryKnowledgeRepository` tool. `answerKnowledgeQuestion` is the model loop that uses this tool.

`runAnswerKnowledgeQuestion` exposes the aggregate answer result. `streamAnswerKnowledgeQuestion` exposes the same agent contract through AI SDK UI Message Stream v1. The stream supports tool approval resume and cancellation. Hono exposes the public login command and protects the knowledge endpoints with `ProtectMiddleware`.

Install the published dependencies and run the framework checks:

```bash title="Install published dependencies"
npm install
```

```bash title="Build the server and UI"
npm run build
```

```bash title="Run the deterministic tests"
npm test
```

The server tests use fake model providers and in memory resource doubles. They do not need an API key or a running database. The PostgreSQL test is separate because it proves pgvector behavior.

To run the complete local application, copy `.env.example` to `.env`, start PostgreSQL, and use the deterministic entry point:

```bash title="Run the local RAG demo"
docker compose up -d --wait
npm run demo
```

The demo uses the real EventBridge, Knowledge service, mounted Harness definition, Hono endpoints, repository, and stream adapter. It uses a scripted model, so no provider credential is needed. Stop the process with `Ctrl+C`, then stop PostgreSQL with `docker compose down`.

For a live model, set `OPENAI_API_KEY` in `.env` and run `npm start`. The live path uses the same service assembly and endpoint contracts.
