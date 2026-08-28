---
title: Run your first evaluation
description: Measure a small classification baseline, inspect a failure, make one change, and rerun the same reviewed cases.
order: 820
---

Start with a classification decision that has a clear business consequence. In
this example, an incident router chooses `urgent` or `normal`. The baseline
looks accurate overall but sends an important minority of security incidents to
the normal queue. The improvement is meaningful only if it fixes that slice
without damaging the rest of the reviewed cases.

The Harness evaluates every candidate, case, and trial in a stable order. The
task receives the case input and candidate configuration. The scorer receives a
separate observation that can include the reviewed answer. This prevents a
reference label from accidentally becoming prompt context for the candidate.

```ts title="src/evaluation/incidentRouting.ts"
import {
  createDeterministicEvaluationScorer,
  runEvaluation,
} from '@purista/harness'

type Incident = { summary: string }
type ReviewedLabel = { expected: 'urgent' | 'normal' }
type Candidate = { classify: (incident: Incident) => 'urgent' | 'normal' }

const correctLabel = createDeterministicEvaluationScorer<ReviewedLabel, { label: 'urgent' | 'normal' }>({
  id: 'reviewed-label',
  version: '1',
  dimension: { id: 'correct', kind: 'boolean' },
  evaluate: (observation) => {
    const passed = observation.output.label === observation.assessment?.expected
    return { outcome: 'scored', dimensionId: 'correct', kind: 'boolean', value: passed, passed }
  },
})

const result = await runEvaluation<Incident, ReviewedLabel, Candidate, { label: 'urgent' | 'normal' }>({
  runId: 'incident-routing-baseline',
  dataset: {
    id: 'incident-routing',
    version: '2026-08-28',
    cases: [
      { id: 'security-minority', input: { summary: 'Credentials appeared in a public log.' }, assessment: { expected: 'urgent' }, segments: { kind: 'security' } },
      { id: 'ordinary-delay', input: { summary: 'A report is delayed by ten minutes.' }, assessment: { expected: 'normal' }, segments: { kind: 'operations' } },
    ],
  },
  candidates: [
    { id: 'baseline', version: '1', config: { classify: () => 'normal' } },
    { id: 'security-aware', version: '2', config: { classify: (incident) => incident.summary.includes('Credentials') ? 'urgent' : 'normal' } },
  ],
  task: {
    id: 'route-incident',
    version: '1',
    run: async (target) => ({ output: { label: target.candidate.classify(target.input) } }),
  },
  scorers: [correctLabel],
  aggregateBy: ['kind'],
})

console.log(result.dimensionAggregates)
```

### What the evaluation definition declares

| Call or field | Purpose and options | Runtime effect and when to use it |
| --- | --- | --- |
| [`createDeterministicEvaluationScorer(...)`](/handbook/api/functions/_purista_harness.createDeterministicEvaluationScorer/) | Creates one scorer from an `id`, `version`, exactly one `dimension`, and synchronous `evaluate(observation)`. A dimension is `boolean`, `number`, or `label`; label dimensions additionally declare their allowed `labels`. | Use it for an exact rule such as this reviewed-label comparison. It validates the scorer identity and dimension when it is created, then wraps `evaluate` in the normal asynchronous scorer contract. Use a full [`EvaluationScorer`](/handbook/api/interfaces/_purista_harness.EvaluationScorer/) for an injected judge, external metric, or a scorer that reports several dimensions. |
| `evaluate(observation)` | Receives the application-owned observation: candidate output, optional scorer-only assessment, optional scorer context, and stable case/candidate/task/trial identities. It returns `scored`, `not_applicable`, or `inconclusive`. | The callback must not mutate or feed `assessment` back into the candidate. Return `inconclusive` for insufficient evidence and let a thrown error become a visible scorer failure instead of inventing a score. |
| [`runEvaluation(...)`](/handbook/api/functions/_purista_harness.runEvaluation/) | Requires `runId`, a versioned `dataset`, non-empty `candidates`, a versioned `task`, and non-empty `scorers`. Optional `trials` defaults to one `default` trial; `aggregateBy` defaults to no segment aggregates; `maxConcurrency` defaults to `1`; `failurePolicy` defaults to `continue`; `retry`, `timeouts`, `signal`, and content-free `telemetry` are opt-in. | It executes the Cartesian product of candidate × case × trial in stable order and scores every successful observation. Choose `continue` to diagnose a whole suite; choose `fail_fast` only when additional external work is unsafe or wasteful. Retries repair callback failures, not a low score or an inconclusive verdict. |
| `dataset` and `candidates` | Each requires stable non-empty `id` and `version`; every case additionally requires `input`. `assessment` is intentionally separate from input and `segments` are string labels used by `aggregateBy`. | Treat versions as measurement identity. Use `segments: { kind: 'security' }` to expose an important slice; never put customer, tenant, prompt, or document identifiers there. |
| `task.run(target, signal)` | Receives the candidate configuration, case input, stable identities, attempt number, and an abort signal. It must return `output`; it may return scorer-only context, an application-owned `outputRef`, correlation, and model accounting. | This is the only callback that invokes the candidate. Honour `signal`; a timeout or cancellation ends Harness waiting but cannot undo a remote side effect. Keep original task accounting separate from any model-backed scorer accounting. |
| `result.dimensionAggregates` | One aggregate per candidate, scorer, dimension, and requested scope, including coverage and value/pass distributions. The full [`EvaluationRunResult`](/handbook/api/interfaces/_purista_harness.EvaluationRunResult/) also retains per-case task/scorer status. | Read per-case failures and coverage before an aggregate. Missing, skipped, errored, not-applicable, and inconclusive work are deliberately not converted into successful scores. |

This offline task proves the mechanics of cases, candidate versions, scorer
identity, segmentation, and reports. Replace only the task callback with an
explicitly configured live Harness session or deployed endpoint when measuring
the real system. Keep its credential, budget, timeout, and redaction policy at
the application boundary.

Read the report before declaring a winner. Inspect the `security` aggregate,
the per-case row, and scorer coverage. A scorer can report `not_applicable` or
`inconclusive`; neither is a pass, failure, or technical error. A task or
scorer error remains visible as an operational result and must not disappear
from the denominator.

Next: [build a reviewed dataset and CI policy](/handbook/harness/test-and-evaluate/evaluation-datasets-and-ci/). For a full classification measurement design, use the [evaluation recipes](/handbook/harness/test-and-evaluate/recipes/).
