# PURISTA Agent Example

This example shows the core-native PURISTA agent builder.

It intentionally does not install a live model provider. The runtime test uses
`createScriptedHarnessModel` from `@purista/core`, so the example stays
provider-neutral and can run in CI without API keys.

## Run

```bash
npm test -w @purista/agent-example
```

## What it demonstrates

- `ServiceBuilder.getAgentQueueBuilder(...)`
- schema-driven payload and output types
- capability-gated model handles on `context.harness.models`
- `createAgentTestHarness(...)` with a scripted model provider
- no direct application dependency on `@purista/harness`
