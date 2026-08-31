---
title: Build evaluation datasets and run them in CI
description: Version reviewed cases, enforce coverage and quality policy in code, and run the same decision gate in CI.
order: 830
---

An evaluation dataset is a reviewed sample of the decisions the system must
make. It is not a production event export and it is not automatically ground
truth. Give the dataset, every case, candidate, task, and scorer a stable
identity so a result states exactly what was measured.

## Define cases separately from candidate code

Only `input` is available to the candidate task. Put expected values and
grading notes in `assessment`, which is visible to scorers after the task has
finished.

```ts title="src/evaluation/incidentRoutingDataset.ts"
import type { EvaluationDataset } from '@purista/harness'

export type Incident = { summary: string }
export type RoutingAssessment = { expected: 'urgent' | 'normal' }

export const incidentRoutingDataset = {
	id: 'incident-routing',
	version: '2026-08-28',
	cases: [
		{
			id: 'public-credential-exposure',
			input: { summary: 'Credentials appeared in a public log.' },
			assessment: { expected: 'urgent' },
			segments: { kind: 'security', language: 'en' },
		},
		{
			id: 'ordinary-report-delay',
			input: { summary: 'A report is delayed by ten minutes.' },
			assessment: { expected: 'normal' },
			segments: { kind: 'operations', language: 'en' },
		},
	],
} as const satisfies EvaluationDataset<Incident, RoutingAssessment>
```

Build the first cases from normal work, authorized and redacted failure review,
and deliberately difficult negative, ambiguous, boundary, and policy-sensitive
examples. Use segments for important slices such as language, document type,
risk, retrieval availability, or a rare class. Never use tenant, user, prompt,
document, or production record identifiers as segments.

Keep a development set and a holdout set. Tune against development. Use the
holdout only at planned checkpoints; once it guides a change, move those cases
into development and prepare a new holdout.

## Express the release decision as code

The Harness returns evidence; the application owns release policy. Check run
status and coverage before reading a pass rate.

```ts title="src/evaluation/assertIncidentRoutingPolicy.ts"
import type { EvaluationRunResult } from '@purista/harness'

export function assertIncidentRoutingPolicy(result: EvaluationRunResult): void {
	if (result.status !== 'completed') {
		throw new Error(`Evaluation did not complete: ${result.status}`)
	}

	const aggregate = result.dimensionAggregates.find(
		item => item.candidateId === 'security-aware' && item.dimensionId === 'correct' && item.scope.kind === 'all',
	)
	if (!aggregate) throw new Error('Missing correct-label aggregate')

	const { coverage, passCounts } = aggregate
	if (coverage.errored > 0 || coverage.skipped > 0 || coverage.inconclusive > 0) {
		throw new Error(`Incomplete evaluation coverage: ${JSON.stringify(coverage)}`)
	}
	if (!passCounts || passCounts.rate < 0.95) {
		throw new Error(`Correct-label rate is ${passCounts?.rate ?? 0}; expected at least 0.95`)
	}
}
```

This threshold is an example for one reviewed routing decision, not a universal
recommendation. Derive each gate from the cost of the failure, dataset quality,
scorer agreement, and required coverage. A critical segment may require its own
gate even when the overall aggregate passes.

## Run the gate with Vitest

Keep the evaluation runner in an ordinary module so local development and CI
execute the same candidate, dataset, and scorer versions.

```ts title="src/evaluation/incidentRouting.evaluation.test.ts"
import { describe, it } from 'vitest'
import { runIncidentRoutingEvaluation } from './runIncidentRoutingEvaluation.js'
import { assertIncidentRoutingPolicy } from './assertIncidentRoutingPolicy.js'

describe('incident routing evaluation', () => {
	it('meets the reviewed release policy', async () => {
		const result = await runIncidentRoutingEvaluation()
		assertIncidentRoutingPolicy(result)
	}, 120_000)
})
```

Add a distinct package script so normal deterministic tests do not silently
start paid or remote evaluations:

```json title="package.json"
{
  "scripts": {
    "test": "vitest run",
    "test:evaluation": "vitest run src/evaluation --testTimeout=120000"
  }
}
```

```yaml title=".github/workflows/incident-routing-evaluation.yml"
name: Incident routing evaluation

on:
  workflow_dispatch:
  pull_request:
    paths:
      - 'src/harness/**'
      - 'src/evaluation/**'

jobs:
  evaluate:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    environment: ai-evaluation
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run test:evaluation
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

Use a protected CI environment for live-provider credentials, budgets, and
manual approval. Pin dependency and dataset versions, bound concurrency and
timeouts, and never retry a low score until it happens to pass. Technical retry
keeps the same trial identity; intentional repeated trials must reset mutable
session and external state and be reported as trials.

The Harness result is content-minimized. Store it as a CI artifact when useful.
Store raw observations only in an application-controlled, access-restricted
location when policy permits and re-scoring or diagnosis requires them. A
failure report should identify case, candidate, scorer, dimension, status, and
approved evidence reference—not copy a customer prompt or record into CI logs.

Next: [choose and calibrate scorers](/handbook/harness/test-and-evaluate/choose-and-calibrate-scorers/).
