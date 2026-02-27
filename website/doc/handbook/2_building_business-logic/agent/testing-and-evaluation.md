---
title: Testing & Evaluation
description: Unit-test agents, capture evaluation JSON, and compare model or prompt revisions safely.
order: 203706
---

# Testing & Evaluation

Agents must remain deterministic enough to ship safely. Treat them like any other PURISTA component: write unit tests, capture evaluation metrics, and diff results in CI.

## Vitest unit tests

The CLI generator creates `supportAgent.test.ts` beside the builder. A minimal test spins up the event bridge, injects a mock provider, and calls the agent handler:

```ts
import { describe, expect, it } from 'vitest'
import { DefaultEventBridge } from '@purista/core'
import { EchoProvider } from '@purista/ai'
import { supportAgentDefinition } from './supportAgent.js'

describe('support agent', () => {
  it('returns a friendly answer', async () => {
    const eventBridge = new DefaultEventBridge()
    await eventBridge.start()

    const agent = await supportAgentDefinition.getInstance({
      eventBridge,
      resources: { model: new EchoProvider() },
    })
    await agent.start()

    const { envelopes } = await agent.invoke({
      payload: { prompt: 'reset password' },
    })

    expect(envelopes.some(env => env.frame.kind === 'message')).toBe(true)

    await agent.stop()
    await eventBridge.destroy()
  })
})
```

Mock providers keep tests deterministic while still exercising session stores, protocol helpers, and tracing hooks.

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

## Document everything

Agents ship alongside services, so apply the same quality bar:

- Document configs and endpoints in the handbook (or internal docs) when you add a new agent.
- Record assumptions (temperature, max workers, tool allowlists) in the repository so on-call engineers understand the blast radius.
- Keep evaluation fixtures under version control. They double as living documentation and make refactors safer.
