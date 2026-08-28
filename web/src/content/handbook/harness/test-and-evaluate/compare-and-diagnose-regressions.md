---
title: Compare results and diagnose regressions
description: Compare matched cases honestly, distinguish trials from retries, and interpret coverage, latency, and cost changes.
order: 860
---

Compare candidates only over matched dataset, case, task, and trial identities.
Report unmatched, skipped, cancelled, timed-out, and errored rows before any
quality conclusion. Comparing only the cases that completed or scored can make
a regression look like an improvement.

Start with per-case differences and then inspect segments. An aggregate can
show that a candidate improved overall while regressing for a critical language,
rare class, unanswerable question, or authorization boundary. The generic
report supplies operational counts, coverage, and declared dimension
distributions. Compute task-specific corpus metrics, such as confusion matrices
or retrieval recall, from their declared sufficient statistics in application
analysis code.

## Keep trials and retries separate

A retry is recovery from a technical callback failure and keeps the same trial
identity. It never retries a low score, an inapplicable dimension, or an
inconclusive judgment. An independent trial intentionally repeats the
candidate/case pair after the application resets session, mutable environment,
and external fixtures. A provider seed or a repeated identifier does not prove
independence.

Use repeated trials when variation itself is a decision risk, and report their
range alongside the number of trials. Do not prescribe one sample size or one
pass-rate threshold for every system. Review dataset quality, scorer agreement,
and the cost of a failure before setting a release policy.

## Read performance and spend correctly

Keep three measurements separate:

| Measurement | Answers |
| --- | --- |
| Original task duration and accounting | How the candidate system performed and what it consumed |
| Scorer duration and accounting | What judging the result added |
| Evaluation wall duration | How long this invocation took, including concurrent work and scheduling |

Missing accounting is unknown, not zero. Token totals preserve the Harness
model usage breakdown, including cache and reasoning fields when reported. A
judge re-score creates new scorer spend but does not recreate or overwrite the
original task accounting. Next: [operate evaluations safely](/handbook/harness/test-and-evaluate/operate-evaluations-safely/).
