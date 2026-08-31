---
title: Operate evaluations safely
description: Turn authorized failures into safer cases while keeping evaluation data, model usage, cost, and telemetry boundaries explicit.
order: 870
---

Treat evaluation data as production-sensitive. A bounded explanation, an opaque
reference, or a no-content trace setting does not make a prompt, output,
assessment, or tool record safe to retain or send to a judge. The application
decides which data is authorized for a candidate, which is scorer-only, which
is stored for later re-scoring, and which may leave the deployment.

Build a controlled production-to-case loop:

1. obtain the required authorization and redact or transform a failure;
2. remove identity and unrelated content;
3. have a qualified reviewer establish the reference or expected invariant;
4. add the case to a versioned development or holdout dataset; and
5. record why the case matters and how the system changed after the rerun.

Do not use evaluation telemetry as an observation store. Evaluation spans and
metrics are content-free, including scores, case identities, references, and
candidate output. The application can run evaluations with no OpenTelemetry SDK,
exporter, collector, or backend account. When it does configure telemetry, the
existing model spans remain the source of provider/model identity and normalized
token usage; evaluation spans describe only the run, case, and scorer lifecycle.

Preserve task accounting, scorer accounting, and whole-evaluation wall time as
separate measurements. Record an explicit currency and pricing source for an
application-provided cost; Harness does not invent prices or bills. Keep trace
or span correlation only when the application observed a valid correlation, and
do not manufacture one from a run identifier.

Use timeouts, bounded concurrency, cancellation, and explicit continue or
fail-fast policy to control evaluation work. A timeout stops cooperative waiting
but cannot undo a remote side effect. Keep irreversible actions out of an
evaluation task unless its fixture owns cleanup.

Apply those limits at the evaluation boundary rather than relying only on the
CI runner timeout:

```ts title="src/evaluation/runProtectedIncidentEvaluation.ts"
import { HarnessError, runEvaluation } from '@purista/harness'
import { candidates } from './incidentRoutingCandidates.js'
import { incidentRoutingDataset } from './incidentRoutingDataset.js'
import { correctLabel } from './incidentRoutingScorers.js'
import { routeIncidentTask } from './routeIncidentTask.js'

const shutdown = new AbortController()
process.once('SIGTERM', () => shutdown.abort())

export async function runProtectedIncidentEvaluation() {
	return runEvaluation({
		runId: `incident-routing-${process.env.GITHUB_RUN_ID ?? 'local'}`,
		dataset: incidentRoutingDataset,
		candidates,
		task: routeIncidentTask,
		scorers: [correctLabel],
		aggregateBy: ['kind', 'language'],
		maxConcurrency: 4,
		failurePolicy: 'continue',
		retry: {
			task: {
				maxAttempts: 2,
				delayMs: 500,
				shouldRetry: error => error instanceof HarnessError && error.retriable,
			},
		},
		timeouts: {
			runMs: 8 * 60_000,
			taskMs: 45_000,
			scorerMs: 30_000,
		},
		signal: shutdown.signal,
	})
}
```

Use retry only for a callback failure classified as retriable. It keeps the
same trial identity and must not repeat an irreversible effect. A low score,
`not_applicable`, or `inconclusive` result is measurement evidence, not a retry
condition. `continue` is useful for a diagnostic suite because later cases
remain visible; choose `fail_fast` when further external work would be unsafe
or unnecessarily expensive.

The environment run ID is operational correlation, not a tenant, user, case,
or trace identity. Do not put sensitive identifiers into `runId`, dataset IDs,
candidate IDs, segments, logs, or artifact names.

Next: [extend and integrate evaluations](/handbook/harness/test-and-evaluate/integrate-evaluations/).
