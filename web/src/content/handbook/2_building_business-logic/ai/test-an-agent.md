---
title: Test An Agent
description: Test PURISTA AI agents with fake model providers, integration harnesses, streams, and unhappy paths.
order: 207040
---

# Test an agent

Use the testing helpers exported from `@purista/core` for deterministic tests. Unit and integration tests should not call real model providers.

The testing helpers let you:

- execute an attached agent definition without starting a full service
- inject fake model providers
- enqueue scripted text, object, embedding, and rerank responses
- create temporary skill bindings for agents that declare `.useSkills(...)`
- assert output validation, capability failures, missing aliases, stream errors, and provider failures

## Success path

```ts
import { createAgentTestHarness, createScriptedHarnessModel } from '@purista/core'

const model = createScriptedHarnessModel()
model.enqueueObject({
  object: {
    priority: 'high',
    reason: 'mentions outage',
  },
  usage: {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  },
  finishReason: 'stop',
})

const harness = await createAgentTestHarness(triageAgent, {
  models: {
    primary: {
      provider: model,
      model: 'fake-object',
      capabilities: ['object'],
    },
  },
})

await expect(
  harness.run({
    payload: {
      ticketId: 'T-1',
      text: 'Production outage for enterprise customer',
    },
    message: { id: 'msg-1' },
  }),
).resolves.toEqual({
  priority: 'high',
  reason: 'mentions outage',
})
```

## Invalid model output

Use invalid fake output to prove the PURISTA output schema is enforced.

```ts
const failingModel = createScriptedHarnessModel()
failingModel.enqueueObject({
  object: { priority: 'unknown' },
  usage: {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  },
  finishReason: 'stop',
})

const failingHarness = await createAgentTestHarness(triageAgent, {
  models: {
    primary: {
      provider: failingModel,
      model: 'fake-object',
      capabilities: ['object'],
    },
  },
})

await expect(
  failingHarness.run({
    payload: {
      ticketId: 'T-2',
      text: 'The request is ambiguous',
    },
  }),
).rejects.toThrow(/output validation failed/i)
```

## Missing alias

Runtime startup should fail when a declared model alias is not bound.

```ts
const missingAliasHarness = createAgentTestHarness(triageAgent, {
  models: {},
})

await expect(
  missingAliasHarness.then(harness => harness.run({
    payload: {
      ticketId: 'T-3',
      text: 'Missing model binding',
    },
  })),
).rejects.toThrow(/missing runtime model binding/i)
```

## Capability mismatch

Assert that tests catch provider capability drift before production startup does.

```ts
const model = createScriptedHarnessModel()

const capabilityHarness = await createAgentTestHarness(triageAgent, {
  models: {
    primary: {
      provider: model,
      model: 'fake-text',
      capabilities: ['text'],
    },
  },
})

await expect(
  capabilityHarness.run({
    payload: {
      ticketId: 'T-4',
      text: 'Provider cannot produce objects',
    },
  }),
).rejects.toThrow(/capabil/i)
```

## Embeddings and rerank

Fake provider calls can cover retrieval flows without a vector provider or external model.

```ts
const model = createScriptedHarnessModel()

model.enqueueEmbedding({
  embeddings: [{ index: 0, vector: [0.1, 0.2, 0.3] }],
  usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
})

model.enqueueRerank({
  results: [{ id: 'doc-2', index: 1, score: 0.92 }],
  usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
})

const harness = await createAgentTestHarness(answerAgent, {
  models: {
    retrieval: {
      provider: model,
      model: 'fake-embedding',
      capabilities: ['embeddings'],
    },
    ranker: {
      provider: model,
      model: 'fake-rerank',
      capabilities: ['rerank'],
    },
    writer: {
      provider: model,
      model: 'fake-object',
      capabilities: ['object'],
    },
  },
})
```

For full RAG tests, keep the vector index as a fake PURISTA resource and assert the handler passes tenant filters and candidate text correctly.

## Skill-backed agents

Agents that declare `.useSkills(...)` need runtime skill bindings in tests, just like they need `ai.skills` bindings in application bootstrap. Use `createAgentSkillTestRuntime(...)` instead of hand-writing temporary skill folders in each test.

```ts
import {
  createAgentSkillTestRuntime,
  createAgentTestHarness,
  createScriptedHarnessModel,
} from '@purista/core'

const skillRuntime = await createAgentSkillTestRuntime([
  {
    name: 'incident-responder',
    description: 'Incident response guidance for tests.',
    body: 'Use the incident severity table before writing the result.',
  },
])

const model = createScriptedHarnessModel()
model.enqueueObject({
  object: {},
  toolCalls: [{
    id: 'read-skill',
    name: 'read',
    arguments: { path: '/skills/incident-responder/SKILL.md' },
  }],
  usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
  finishReason: 'tool_calls',
})
model.enqueueObject({
  object: { priority: 'high', reason: 'matches severity table' },
  usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
  finishReason: 'stop',
})

const harness = await createAgentTestHarness(triageAgent, {
  models: {
    primary: {
      provider: model,
      model: 'fake-object',
      capabilities: ['object', 'tool_use'],
    },
  },
  skills: skillRuntime.skills,
})

await expect(harness.run({ payload: { ticketId: 'T-7', text: 'outage' } })).resolves.toEqual({
  priority: 'high',
  reason: 'matches severity table',
})

expect(String(model.requests[0]?.messages?.[0]?.content)).toContain('Available skills')
expect(String(model.requests[0]?.messages?.[0]?.content)).not.toContain('severity table')

await skillRuntime.cleanup()
```

For namespaced declarations such as `.useSkills(['incident-responder'], 'support-skills')`, pass the same `resourceName` to the test helper:

```ts
const skillRuntime = await createAgentSkillTestRuntime([
  {
    name: 'incident-responder',
    resourceName: 'support-skills',
  },
])
```

`createAgentSkillTestRuntime(...)` is a test binding helper, not a production sandbox or workspace adapter. Production sandbox and workspace adapters remain harness runtime wiring supplied through `ai.sandbox`, `ai.runtime`, or `ai.workspaceStore`.

## Streams

For HTTP stream behavior, assert the generated stream chunks rather than real provider protocols.

```ts
const result = await harness.stream({
  payload: {
    ticketId: 'T-5',
    text: 'Stream this run',
  },
})

const chunks = result.chunks

expect(chunks.some(chunk => chunk.data?.type === 'response.created')).toBe(true)
expect(chunks.some(chunk => chunk.data?.type === 'response.completed')).toBe(true)
```

Also test stream writer failures. A failed writer should reject the stream run and call the failure path instead of losing the error.

## Command tools and child agents

When an agent declares `canInvoke(...)` or `canInvokeAgent(...)`, test both success and failure behavior.

```ts
await expect(
  harness.run({
    payload: {
      ticketId: 'T-6',
      text: 'Needs enrichment',
    },
    appContext: {
      service: fakeServiceWithCommandFailure,
    },
  }),
).rejects.toThrow(/customer lookup failed/i)
```

Useful assertions:

- the expected command or child agent was called once
- payload and parameter values are schema-shaped
- command failure propagates or maps to the intended agent output
- child-agent invalid output fails validation
- cancellation stops downstream calls

## Integration tests

Keep a small number of service-level integration tests around the generated PURISTA artifacts:

- service startup fails without `queueBridge`
- service startup fails without `ai.models`
- aggregate command returns validated output
- stream endpoint emits lifecycle chunks and closes with final output
- long-running response mode returns `jobId`, `runId`, `statusUrl`, or `streamUrl`
- queue worker retries and dead-letter behavior follow the configured queue bridge

## Live-provider smoke tests

Live-provider tests are optional and should be isolated from normal CI. Use them only to verify credentials, endpoint configuration, provider options, and model availability.

Normal CI should run against fake providers.

## Checklist

- no unit test calls a real provider
- fake provider tests cover success and invalid output
- missing alias and capability mismatch are covered
- command tool and child-agent unhappy paths are covered
- stream success and writer failure paths are covered
- long-running queue behavior has integration coverage
