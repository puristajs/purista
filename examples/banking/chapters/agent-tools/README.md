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
```

The integration test uses a strict fake model and a real `DefaultEventBridge`.
It needs no model key or external service.
