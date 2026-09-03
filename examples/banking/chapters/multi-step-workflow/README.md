# Multi-step workflow tutorial source

This focused project runs schema-validated agent stages inside durable Harness
steps and invokes the workflow through a protected PURISTA command.

```bash
npm install
npm run build
npm test
npm run lint
```

The test uses strict fake providers, in-memory durable storage, and a real
`DefaultEventBridge`.

