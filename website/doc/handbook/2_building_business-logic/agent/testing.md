---
title: Testing
description: Choose the right testing level for PURISTA agents and keep tests deterministic through provider doubles and runtime harnesses.
order: 203709
---

# Testing

The most important testing question is not “which helper exists?”

It is:

> What exactly am I trying to verify?

Once that is clear, the right PURISTA testing helper becomes obvious.

## The Three Levels

### 1. Service-level tests

Use normal `@purista/core` mocks when you are testing service logic and do not need a real agent runtime.

Use this when:

- a command invokes an agent
- a subscription emits events
- a service handler wires dependencies correctly

This is still the right level for pure service behavior.

### 2. Handler tests

Use `createAgentContextMock(...)` when you want to test the handler logic directly without booting a whole agent instance.

Use this when:

- you want to test prompt construction
- you want to test how the handler reacts to tool or child-agent results
- you want deterministic unit tests around branching logic

Example:

```ts
import { createAgentContextMock } from '@purista/ai'

const mock = createAgentContextMock({
  payload: { prompt: 'Reset password' },
  commands: {
    support: {
      '1': {
        lookupFaq: async payload => ({ answer: `FAQ:${payload.question}` }),
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

This is the best starting point for handler-only behavior.

### 3. Runtime tests

Use `createAgentTestHarness(...)` when you want to boot a real agent instance and verify the actual runtime behavior.

Use this when:

- you want to test inline vs queued execution
- you want to assert streamed frames
- you want to verify run-state artifacts
- you want to test real instance creation wiring

Example:

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

This is the right level when the runtime itself is part of what you are testing.

## Which Level Should I Pick?

- “I am testing a service command that happens to call an agent.”
  Use service-level tests.
- “I am testing the handler logic of one agent.”
  Use `createAgentContextMock(...)`.
- “I am testing how the built agent actually runs.”
  Use `createAgentTestHarness(...)`.

That decision is more useful than memorizing helper names.

## Provider Doubles

Keep provider behavior deterministic.

### `ScriptedModel`

Use `ScriptedModel` for ordered, step-by-step model behavior:

```ts
const model = new ScriptedModel()
  .nextJson({ urgency: 'high' })
  .nextStream(['Working ', 'on it'])
```

Use this when:

- the sequence matters
- the test should read like a script

### `MockModel`

Use `MockModel` when matcher-based replies are easier than an ordered script.

Use this when:

- the prompt shape matters more than the exact call order
- one test needs several branching prompt matches

## What To Assert

### Final result only

If only the final assistant message matters:

```ts
expect(result.finalMessage).toContain('Resolved')
```

### Tool execution

If the agent should call commands or child agents:

```ts
expect(result.toolFrames.length).toBeGreaterThan(0)
```

### Durable progress

If the agent is queued durable:

```ts
expect(result.runStateArtifacts.length).toBeGreaterThan(0)
```

### Full envelopes

If you truly need protocol details, assert on `result.frames` or raw envelopes, but keep that as the advanced path.

## Common Testing Scenarios

### Validate branching logic

Use `createAgentContextMock(...)`.

### Validate queued durable progress

Use `createAgentTestHarness(...)` and assert `runStateArtifacts`.

### Validate tool-loop integration

Use `createAgentTestHarness(...)` with `ScriptedModel` and assert `toolFrames`.

### Validate input schema rejection

Use the runtime harness and pass invalid payloads, or test the builder/service boundary that owns the schema.

## Common Mistakes

- Using the full runtime harness for simple handler branching tests.
- Asserting raw envelopes when `finalMessage`, `toolFrames`, or `runStateArtifacts` would be clearer.
- Letting provider behavior stay non-deterministic.
- Treating service-level tests and agent runtime tests as interchangeable.

## Related Guides

- [Quick Start](./getting-started.md)
- [Context](./handler-context.md)
- [Durable Run State](./run-state.md)
