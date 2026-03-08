---
title: Agent Evaluation
description: Build repeatable evaluation runs and compare agent quality metrics as JSON artifacts.
order: 203709
---

# Agent Evaluation

Testing and evaluation solve different problems:

- **Tests** protect behavior/contracts in deterministic conditions.
- **Evaluation** compares quality over datasets (accuracy, latency, token usage) across models/prompts.

Use both.

## What to evaluate and why

| Metric | What it answers | Typical decision supported |
| --- | --- | --- |
| accuracy / success rate | does output match expected intent? | prompt/model regression checks |
| duration (`min/max/avg`) | how fast is the agent? | sync vs async route suitability |
| token usage | how expensive is context+output size? | memory strategy and model sizing |
| failure rate | how often runs fail? | retry policy and guardrail tuning |
| call-option stability | do dynamic `prepareCall` / `prepareStep` policies stay within expected bounds? | safe rollout of adaptive temperature/max-token policies |

## Evaluation output contract

Dataset shape is intentionally up to the application.  
Evaluation output should be JSON and stable over time so CI can diff it.

Typical fields:

- suite name and timestamp
- case-level pass/fail
- duration statistics (min/max/avg/total)
- token usage statistics (prompt/completion/total)
- aggregate accuracy/failure rate
- optional call-option trace (step, callKind, selected options) for debugging adaptive policies

## Evaluating dynamic call-option hooks

If the agent uses `prepareCall(...)` or `prepareStep(...)`, include that behavior in your evaluation assertions.

Recommended checks:

- step policy correctness (for example `temperature` ramps down after N steps)
- safety bounds (for example `maxOutputTokens` never exceeds policy ceiling)
- drift detection (same dataset + same seed should keep option traces stable enough)

You can capture this by writing hook metadata and/or explicit step tags into the evaluation sample.

## Example flow

```ts
import { createEvaluationResult, diffEvaluationResults, validateDataset } from '@purista/ai/evaluation'
import { z } from 'zod/v4'
import { extendApi } from '@purista/core'

const datasetSchema = extendApi(
  z.object({
    id: z.string(),
    prompt: z.string(),
    expectedSubstring: z.string(),
  }),
  { title: 'Support Eval Row' },
)

const dataset = await validateDataset(datasetSchema.array(), await loadJson('support-regression.json'))

const optionTrace = []
const samples = []
for (const row of dataset) {
  const started = performance.now()
  const envelopes = await invokeAgent({
    eventBridge,
    agentName: 'supportAgent',
    agentVersion: '1',
    payload: { prompt: row.prompt, message: row.prompt, history: [], attachments: [] },
  })

  const finalMessage = envelopes
    .map(e => e.frame)
    .filter((f): f is { kind: 'message'; content: string; final?: boolean } => f.kind === 'message')
    .findLast(f => f.final === true)?.content

  samples.push({
    id: row.id,
    expected: row.expectedSubstring,
    actual: finalMessage ?? '',
    success: (finalMessage ?? '').includes(row.expectedSubstring),
    durationMs: performance.now() - started,
  })
}

const current = createEvaluationResult({
  workload: 'supportAgent',
  manifestVersion: '1',
  dataset: 'support-regression',
  samples,
  metadata: {
    dynamicCallOptions: optionTrace,
  },
})

const diff = diffEvaluationResults(previousRun, current)
```

## Storage recommendation

Store results under a predictable structure:

```text
evaluations/
  support-regression/
    2026-03-04T10-00-00Z.json
    2026-03-05T10-00-00Z.json
```

This makes comparisons and regressions visible in pull requests and release checks.

## CI usage

- Run evaluation as part of a dedicated pipeline stage (not necessarily every unit-test run).
- Keep threshold checks explicit (for example: accuracy must not drop by more than 2%).
- Publish JSON artifacts for later inspection and trend dashboards.
