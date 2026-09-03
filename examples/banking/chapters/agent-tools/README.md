# PURISTA agent tools tutorial source

This focused project shows how a native Harness host-tool contract is bound to
address-first PURISTA capabilities. The model can request a transaction summary,
but the host binding invokes a guarded `Transaction` command through EventBridge.
Trusted tenant and principal identity come from the PURISTA message.

```bash
npm install
npm run build
npm test
npm run lint
npm run demo
```

The default demo and tests use a strict fake model. The integration test also
uses a real `DefaultEventBridge`, so the complete model-tool-command path needs
no model key or external service.

To try the same composition with OpenAI, copy `.env.example`, set
`OPENAI_API_KEY`, and run `npm start`.
