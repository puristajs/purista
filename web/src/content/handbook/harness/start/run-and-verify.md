---
title: Run and verify the agent
description: Prove the first live run and the deterministic test path separately.
order: 60
---

Use separate evidence for the live provider path and routine tests. A passing
live call proves credentials and provider access. It does not make an agent
deterministic or production-ready.

## Run a bounded live check

```sh title="Run the live support-agent check"
OPENAI_API_KEY=replace-with-a-secret node dist/index.js
```

Expected evidence is a schema-valid result, not a fixed sentence. Capture only
safe operational metadata such as success/failure, duration, and token usage;
do not copy prompts, completions, tool values, or credentials into logs.

## Test without a provider

The maintained Harness quickstart injects an `ExampleProvider` that implements
`ModelProvider` and returns a fixed object. Run its focused test from the
Harness repository:

```sh title="Run the deterministic quickstart test"
npm test --workspace @purista/quickstart
```

This verifies agent/session/workflow wiring without a network call or API key.
Use the same pattern for application tests. Keep one explicit, access-controlled
live smoke test outside normal CI when provider connectivity matters.

## Clean up

Call `harness.shutdown()` when the application process stops. Do not create a
new Harness for every request; build the composition once and open/release
sessions at the appropriate application boundary.

Next: [understand the project shape](/handbook/harness/start/understand-the-project/).
