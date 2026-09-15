# PURISTA agent tools tutorial source

This focused project shows how a PURISTA service-owned Harness tool uses
address-first PURISTA capabilities. The model can request a transaction summary,
and the tool invokes a guarded `Transaction` command through EventBridge.
Trusted tenant and principal identity come from the PURISTA message.

Run `npm install`, then use `npm run build`, `npm test`, and `npm run lint` to
verify the project. Run `npm run demo` for the credential-free example.

The default demo and tests use a strict fake model. The integration test also
uses a real `DefaultEventBridge`, so the complete model-tool-command path needs
no model key or external service.

To try the same composition with OpenAI, copy `.env.example`, set
`OPENAI_API_KEY`, and run `npm start`.
