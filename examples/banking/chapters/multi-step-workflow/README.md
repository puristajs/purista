# Multi-step workflow tutorial source

This focused project runs schema-validated agent stages inside durable Harness
steps and invokes the workflow through a business-authorized PURISTA command.

```bash
npm install
npm run build
npm test
npm run lint
npm run demo
```

The tests and demo use strict fake providers, in-memory Harness storage, and a
real `DefaultEventBridge`, so they need no API key. The optional live
`npm start` composition uses SQLite Harness storage under `.data` and requires
`OPENAI_API_KEY`.
