# Parallel agents tutorial source

This focused project defines two native Harness specialists and a bounded
fan-out workflow, then invokes the workflow from a protected PURISTA command.

```bash
npm install
npm run build
npm test
npm run lint
npm run demo
```

The tests and demo use two strict fake model providers and a real
`DefaultEventBridge`, so they need no API key. Set `OPENAI_API_KEY` only for
the optional live `npm start` composition.
