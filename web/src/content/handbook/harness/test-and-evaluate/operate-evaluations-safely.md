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
evaluation task unless its fixture owns cleanup. Next: [extend and integrate evaluations](/handbook/harness/test-and-evaluate/integrate-evaluations/).
