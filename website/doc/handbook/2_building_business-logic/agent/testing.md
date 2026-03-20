---
title: Testing
description: How to ensure your agents are reliable, deterministic, and high-quality.
order: 203708
---

# Testing

Testing LLM-based applications is notoriously difficult because of their non-deterministic nature. PURISTA provides tools to make your agent tests **reliable**, **fast**, and **deterministic**.

## 1. Testing Levels

Use three layers depending on what you want to verify:

- `@purista/core` mocks for service-level command, subscription, event bridge, and queue bridge tests.
- `createAgentContextMock(...)` for agent handler unit tests.
- `createAgentTestHarness(...)` for inline and queued runtime tests.

### Service-level Tests

Keep pure service tests on the core helper layer:

- `getCommandContextMock(...)`
- `getEventBridgeMock()`
- `getQueueBridgeMock()`

These are the right choice when you do not need a real agent runtime.

### Agent Handler Unit Tests

Use `createAgentContextMock(...)` when you want a real `AgentHandlerContext` without booting an agent instance:

```ts
import { createAgentContextMock } from '@purista/ai'

const mock = createAgentContextMock({
  payload: { prompt: 'Reset password' },
  commands: {
    support: {
      '1': {
        lookupFaq: async (payload) => ({ answer: `FAQ:${payload.question}` }),
      },
    },
  },
  agents: {
    triageAgent: {
      '1': {
        text: 'urgent',
      },
    },
  },
})

const result = await mock.context.tools.invoke.support['1'].lookupFaq({
  question: 'Reset password',
})

expect(result.answer).toContain('FAQ:')
expect(mock.stubs.commands.support['1'].lookupFaq.calls).toHaveLength(1)
```

The mock context includes:

- `context.tools`
- `context.agents`
- `context.expose`
- `context.runState`
- protocol collection through `frames()`, `envelopes()`, and `flush()`

### Agent Runtime Tests

Use `createAgentTestHarness(...)` when you want to boot a real agent instance and assert normalized results:

```ts
import { ScriptedModel, createAgentTestHarness } from '@purista/ai'

const harness = await createAgentTestHarness(supportAgent, {
  models: {
    'openai:gpt-4o-mini': new ScriptedModel().nextText('Resolved'),
  },
})

const result = await harness.run({
  payload: { prompt: 'My laptop is broken' },
})

expect(result.finalMessage).toBe('Resolved')
expect(result.toolFrames).toEqual([])
await harness.destroy()
```

The harness normalizes:

- `finalMessage`
- `frames`
- `toolFrames`
- `artifactFrames`
- `telemetryFrames`
- `runStateArtifacts`

## 2. Provider Doubles

`ScriptedModel` is the default model double for multi-step tests because it is ordered and explicit.

```ts
const model = new ScriptedModel()
  .nextJson({ urgency: 'high' })
  .nextStream(['Working ', 'on it'])
```

Use `MockModel` when matcher-based scripting is more convenient:

- `.on(string | RegExp).reply(string | fn)`
- `.onJson(matcher).reply(object | fn)`

## 3. Protocol Assertions

Use the protocol helpers instead of scanning envelopes manually:

- `getFinalAssistantText(...)`
- `getToolFrames(...)`
- `getArtifactFrames(...)`
- `getRunStateArtifacts(...)`
- `getTelemetryFrames(...)`

These helpers are read-only and keep assertions short without hiding the raw envelopes.

## 4. Strategies for Reliable Tests

### A. Schema Validation
Verify that your agent correctly handles malformed input. Because you've defined `addPayloadSchema`, PURISTA will automatically throw a `HandledError` before the agent even starts.

### B. State/History Checks
If your agent uses `persistConversation`, you can verify the history state after a run:

```ts
const state = await harness.instance.invoke({
  payload: { prompt: 'hello', sessionId: 'test-session' },
})
expect(state.envelopes.length).toBeGreaterThan(0)
```

### C. Deterministic Output
Use `ScriptedModel` or `MockModel` to verify how your agent handler processes model output, including JSON extraction, streaming, reasoning, and fallback behavior.

### D. Queued Durable Runs
When the agent uses `setExecutionMode('queued')`, `createAgentTestHarness(...)` automatically accepts or provisions a queue bridge. Assert `run-state` artifacts or final messages directly:

```ts
const harness = await createAgentTestHarness(supportAgent, {
  models: { 'openai:gpt-4o-mini': model },
})

const result = await harness.run({
  payload: { prompt: 'Create architecture draft', sessionId: 's-1' },
})

expect(result.runStateArtifacts.length).toBeGreaterThan(0)
await harness.destroy()
```

## 5. Evaluation Datasets (Advanced)

For production-ready agents, unit tests are not enough. You need to evaluate the **quality** of the LLM responses.

PURISTA supports an "Evaluation Mode" where you can run your agent against a dataset of "Golden Questions" and "Expected Answers."

- **Metrics**: BLEU, ROUGE, or LLM-as-a-judge scoring.
- **CI/CD**: Block deployments if the evaluation score drops below a certain threshold.

See the [AI Basic Example](https://github.com/purista-js/purista/tree/main/examples/ai-basic) for a complete reference on evaluation datasets.
