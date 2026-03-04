---
title: Testing & Evaluation
description: Unit-test agents, capture evaluation JSON, and compare model or prompt revisions safely.
order: 203706
---

# Testing & Evaluation

Agents must remain deterministic enough to ship safely. Treat them like any other PURISTA component: write unit tests, capture evaluation metrics, and diff results in CI.

## Agent test scaffold from CLI

`purista add agent ...` generates a `*.test.ts` file beside the new builder. The scaffold is runnable out of the box and already includes:

- in-memory `DefaultEventBridge` startup/shutdown
- deterministic provider injection (`EchoProvider`)
- one real agent invocation
- assertions for final protocol message + telemetry frame

Use that generated test as the baseline and extend with project-specific scenarios.

## Unit test pattern (agent runtime)

Use deterministic providers so tests stay stable and do not call external LLM APIs:

```ts
import { describe, expect, it } from 'vitest'
import { DefaultEventBridge } from '@purista/core'
import type { ModelProvider, ProviderRequest } from '@purista/ai'
import { supportAgentDefinition } from './supportAgent.js'

class DeterministicProvider implements ModelProvider {
  name = 'deterministic-test-provider'
  async generate(request: ProviderRequest) {
    return {
      output: `MODEL:${request.prompt}`,
      tokens: { prompt: request.prompt.length, completion: 12 },
      costUsd: 0,
    }
  }
}

describe('support agent', () => {
  it('returns a friendly answer', async () => {
    const eventBridge = new DefaultEventBridge()
    await eventBridge.start()

    const agent = await supportAgentDefinition.getInstance(eventBridge, {
      models: { 'openai:gpt-5.2-mini': new DeterministicProvider() },
    })
    await agent.start()
    await new Promise(resolve => setTimeout(resolve, 25))

    const { envelopes } = await agent.invoke({
      payload: { prompt: 'reset password', message: 'reset password', history: [], attachments: [] },
    })

    const hasFinalMessage = envelopes.some(
      env => env.frame.kind === 'message' && env.frame.final === true,
    )
    const hasTelemetry = envelopes.some(env => env.frame.kind === 'telemetry')

    expect(hasFinalMessage).toBe(true)
    expect(hasTelemetry).toBe(true)

    await agent.stop()
    await eventBridge.destroy()
  })
})
```

This executes the full runtime path (schema validation, tool guards, protocol framing, telemetry, session helpers) without network flakiness.

## Integration test pattern (command -> agent)

When commands invoke agents via `.canInvokeAgent(...).setCommandFunction(...)`, test the wiring through a real command invocation:

```ts
import { DefaultEventBridge, EBMessageType, getNewEBMessageId, getNewTraceId } from '@purista/core'

const message = {
  id: getNewEBMessageId(),
  timestamp: Date.now(),
  traceId: getNewTraceId(),
  correlationId: getNewEBMessageId(),
  messageType: EBMessageType.Command,
  contentType: 'application/json',
  contentEncoding: 'utf-8',
  sender: {
    serviceName: 'testClient',
    serviceVersion: '1',
    serviceTarget: 'integration',
    instanceId: eventBridge.instanceId,
  },
  receiver: {
    serviceName: 'support',
    serviceVersion: '1',
    serviceTarget: 'runSupportAgent',
  },
  payload: { payload: { prompt: 'How can I reset my password?' }, parameter: {} },
}

const result = await eventBridge.invoke(message)
expect(result).toEqual(expect.objectContaining({ message: expect.stringContaining('MODEL:') }))
```

This validates:

- command payload/parameter schemas
- `context.invokeAgent` integration
- agent output mapping back to command response contracts

## Evaluation helpers

`@purista/ai/evaluation` exports utilities to describe datasets and produce JSON outputs you can diff in CI:

```ts
import { createEvaluationResult, diffEvaluationResults, validateDataset } from '@purista/ai/evaluation'
import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

const datasetSchema = extendApi(
  z.object({
    id: z.string(),
    prompt: z.string(),
    expectedSubstring: z.string(),
  }),
  { title: 'Support Eval Row' },
)

const dataset = await validateDataset(datasetSchema.array(), await loadJson('support-regression.json'))

const samples = []
for (const row of dataset) {
  const start = performance.now()
  const envelopes = await invokeAgent({ ... })
  const message = envelopes.find(env => env.frame.kind === 'message')
  const success = message?.frame.content.includes(row.expectedSubstring) ?? false
  samples.push({
    input: row.prompt,
    expected: row.expectedSubstring,
    actual: message?.frame.content,
    success,
    durationMs: performance.now() - start,
  })
}

const baseline = createEvaluationResult({
  workload: 'supportAgent',
  manifestVersion: supportAgentDefinition.info.agentVersion,
  dataset: 'support-regression',
  samples,
})

const comparison = diffEvaluationResults(previousRun, baseline)
```

Store the resulting JSON under `evaluations/<suite>/<timestamp>.json`. The structure is intentionally generic: every result includes accuracy stats, durations, and token totals so you can compare different providers or prompt versions.

```json
{
  "suite": "support-regression",
  "timestamp": 1732656000000,
  "cases": [
    {
      "id": "reset-password",
      "status": "pass",
      "durationMs": 842,
      "tokenUsage": { "prompt": 122, "completion": 98 }
    }
  ]
}
```

- The dataset format is up to you—CSV, JSON, markdown—all work as long as the evaluator knows how to read it.
- Outputs are always JSON so pipelines can diff and fail builds when regressions occur.
- Because evaluation runs are regular Node scripts, you can integrate them into `pnpm test`, nightly cron jobs, or manual verification before deploying a new manifest.

## Reference implementation

`examples/ai-basic` includes runnable tests for both patterns:

- `/examples/ai-basic/src/agents/supportAgent/v1/supportAgent.test.ts`
- `/examples/ai-basic/src/service/support/v1/command/runSupportAgent/runSupportAgentCommandBuilder.test.ts`

## Document everything

Agents ship alongside services, so apply the same quality bar:

- Document configs and endpoints in the handbook (or internal docs) when you add a new agent.
- Record assumptions (temperature, runtime pool sizing, tool allowlists) in the repository so on-call engineers understand the blast radius.
- Keep evaluation fixtures under version control. They double as living documentation and make refactors safer.
